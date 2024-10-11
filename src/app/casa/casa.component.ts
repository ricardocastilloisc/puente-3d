import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-casa',
  templateUrl: './casa.component.html',
  styleUrls: ['./casa.component.css']
})
export class CasaComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initScene();
    this.fetchCasaData();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(400, 400);

    const container = document.getElementById('casa-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    // Cambiar la posición de la cámara para ver la casa
    this.camera.position.set(0, 5, 10);  // Ajusta el eje Y para ver la casa desde arriba
    this.camera.lookAt(0, 1, -1);         // Asegúrate de que la cámara esté mirando hacia la casa
    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Hacer que la casa gire lentamente
    this.scene.rotation.y += 0.01; // Gira la casa en el eje Y

    this.renderer.render(this.scene, this.camera);
  }

  private fetchCasaData(): void {
    this.http.get('https://fastapi-app-8a18.onrender.com/casa').subscribe((data: any) => {
      this.createHouse(data);
    });
  }

  private createHouse(data: any): void {
    // Crear paredes
    data.paredes.forEach((pared: any) => {
      const geometry = new THREE.BoxGeometry(pared.ancho, pared.alto, pared.profundidad);
      const material = new THREE.MeshBasicMaterial({ color: pared.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pared.posicion[0], pared.posicion[1], pared.posicion[2]);
      this.scene.add(mesh);
    });

    // Crear techo
    const techo = data.techo;
    const geometryTecho = new THREE.ConeGeometry(techo.radio, techo.altura, 4);
    const materialTecho = new THREE.MeshBasicMaterial({ color: techo.color });
    const meshTecho = new THREE.Mesh(geometryTecho, materialTecho);
    meshTecho.position.set(techo.posicion[0], techo.posicion[1], techo.posicion[2]);
    this.scene.add(meshTecho);

    // Crear jardín
    const jardin = data.jardin;
    const geometryJardin = new THREE.PlaneGeometry(jardin.ancho, jardin.alto);
    const materialJardin = new THREE.MeshBasicMaterial({ color: jardin.color, side: THREE.DoubleSide });
    const meshJardin = new THREE.Mesh(geometryJardin, materialJardin);
    meshJardin.position.set(jardin.posicion[0], jardin.posicion[1], jardin.posicion[2]);
    meshJardin.rotation.x = Math.PI / 2; // Asegúrate de que el jardín esté horizontal
    this.scene.add(meshJardin);
  }
}
