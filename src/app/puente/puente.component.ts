import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-puente',
  templateUrl: './puente.component.html',
  styleUrls: ['./puente.component.css']
})
export class PuenteComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initScene();
    this.fetchPuenteData();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 400/ 400, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(400, 400);

    const container = document.getElementById('puente-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    // Cambiar la posición de la cámara para ver el puente de lado
    this.camera.position.set(0, 3, 10);  // Ajusta el eje Y para ver el puente desde un lado
    this.camera.lookAt(0, 1, 0);          // Asegúrate de que la cámara esté mirando hacia el puente
    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Hacer que el puente gire lentamente
    this.scene.rotation.y += 0.01; // Gira el puente en el eje Y

    this.renderer.render(this.scene, this.camera);
  }

  private fetchPuenteData(): void {
    this.http.get('https://fastapi-app-8a18.onrender.com/puente').subscribe((data: any) => {
      this.createBridge(data);
    });
  }

  private createBridge(data: any): void {
    // Crear torres
    data.torres.forEach((torre: any) => {
      const geometry = new THREE.BoxGeometry(torre.ancho, torre.alto, torre.profundidad);
      const material = new THREE.MeshBasicMaterial({ color: torre.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(torre.posicion[0], torre.posicion[1], torre.posicion[2]);
      this.scene.add(mesh);
    });


    // Crear plataforma
    const plataforma = data.plataforma;
    const geometry = new THREE.BoxGeometry(plataforma.ancho, plataforma.alto, plataforma.profundidad);
    const material = new THREE.MeshBasicMaterial({ color: plataforma.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(plataforma.posicion[0], plataforma.posicion[1], plataforma.posicion[2]);
    this.scene.add(mesh);
  }
}
