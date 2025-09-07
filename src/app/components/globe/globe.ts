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
  private animationId!: number;
  private rotationSpeed: number = 0.002; // Velocidade de rotação mais lenta

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
    
    // Inclinar a Terra ligeiramente como no mundo real (23.5 graus)
    this.earth.rotation.x = -0.41; // -23.5 graus em radianos
    
    this.scene.add(this.earth);

    // Continents outlines
    this.addContinents();

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

    // Rotate earth - rotação suave e contínua como a Terra real
    this.earth.rotation.y += this.rotationSpeed;

    // Rotate all continent lines with the earth
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Line) {
        child.rotation.y += this.rotationSpeed;
      }
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
