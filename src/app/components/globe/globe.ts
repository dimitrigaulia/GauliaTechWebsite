import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.html',
  styleUrls: ['./globe.scss']
})
export class GlobeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private earth!: THREE.Mesh;
  private points: THREE.Mesh[] = [];
  private connections: THREE.Line[] = [];
  private animationId!: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJS();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }

  private initThreeJS(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    // Continents outlines
    this.addContinents();

    // Create connection points
    this.createConnectionPoints();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);

    // Handle resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.onWindowResize());
    }
  }

  private createConnectionPoints(): void {
    const pointCount = 50;
    const radius = 2.5;

    // Create points
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const pointGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const pointMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
      });
      
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      point.position.set(x, y, z);
      this.points.push(point);
      this.scene.add(point);
    }

    // Create connections between nearby points
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const distance = this.points[i].position.distanceTo(this.points[j].position);
        
        if (distance < 1.5) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            this.points[i].position,
            this.points[j].position
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          this.connections.push(line);
          this.scene.add(line);
        }
      }
    }
  }

  private addContinents(): void {
    fetch('assets/data/continents.geojson')
      .then(response => response.json())
      .then((data: any) => {
        const material = new THREE.LineBasicMaterial({ color: 0x00d4ff });
        const radius = 2.01;
        data.features.forEach((feature: any) => {
          const geom = feature.geometry;
          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: number[][]) => {
              const points = ring.map(([lon, lat]: number[]) => this.latLonToVector3(lat, lon, radius));
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.Line(geometry, material);
              this.scene.add(line);
            });
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((polygon: number[][][]) => {
              polygon.forEach((ring: number[][]) => {
                const points = ring.map(([lon, lat]: number[]) => this.latLonToVector3(lat, lon, radius));
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
              });
            });
          }
        });
      });
  }

  private latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  private animate(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate earth
    this.earth.rotation.y += 0.005;

    // Animate points
    this.points.forEach((point, index) => {
      point.rotation.x += 0.01;
      point.rotation.y += 0.01;
      
      // Pulse effect
      const scale = 1 + Math.sin(Date.now() * 0.001 + index) * 0.2;
      point.scale.setScalar(scale);
    });

    // Animate connections
    this.connections.forEach((connection, index) => {
      const opacity = 0.1 + Math.sin(Date.now() * 0.001 + index) * 0.2;
      (connection.material as THREE.LineBasicMaterial).opacity = opacity;
    });

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
