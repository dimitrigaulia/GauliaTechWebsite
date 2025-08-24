import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private globe!: THREE.Mesh;
  private points: THREE.Mesh[] = [];
  private connections: THREE.Line[] = [];
  private animationId!: number;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initThreeJS();
    this.animate();
  }

  ngAfterViewInit() {
    this.setupResizeHandler();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThreeJS() {
    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    // Globe
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // Points
    this.createPoints();

    // Connections
    this.createConnections();
  }

  private createPoints() {
    const pointGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 50; i++) {
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      
      // Random position on sphere surface
      const phi = Math.acos(-1 + (2 * i) / 50);
      const theta = Math.sqrt(50 * Math.PI) * phi;
      
      const x = 2.2 * Math.cos(theta) * Math.sin(phi);
      const y = 2.2 * Math.sin(theta) * Math.sin(phi);
      const z = 2.2 * Math.cos(phi);
      
      point.position.set(x, y, z);
      this.points.push(point);
      this.scene.add(point);
    }
  }

  private createConnections() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.3
    });

    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const distance = this.points[i].position.distanceTo(this.points[j].position);
        
        if (distance < 3) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            this.points[i].position,
            this.points[j].position
          ]);
          
          const line = new THREE.Line(geometry, lineMaterial);
          this.connections.push(line);
          this.scene.add(line);
        }
      }
    }
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate globe
    this.globe.rotation.y += 0.005;
    this.globe.rotation.x += 0.002;

    // Animate points
              this.points.forEach((point, index) => {
            point.rotation.y += 0.01;
            const material = point.material as THREE.MeshBasicMaterial;
            material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + index);
          });

    // Animate connections
    this.connections.forEach((connection, index) => {
      const material = connection.material as THREE.LineBasicMaterial;
      material.opacity = 0.1 + 0.2 * Math.sin(Date.now() * 0.0005 + index);
    });

    this.renderer.render(this.scene, this.camera);
  }

  private setupResizeHandler() {
    window.addEventListener('resize', () => {
      const container = this.globeContainer.nativeElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
