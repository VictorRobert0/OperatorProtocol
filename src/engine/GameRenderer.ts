import * as THREE from 'three';
import { Player, Vector3 as GameVector3 } from '../types/game';

export class GameRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private playerMeshes: Map<string, THREE.Group> = new Map();
  private raycaster: THREE.Raycaster;
  private clock: THREE.Clock;
  private container: HTMLElement | null = null;
  
  // Map elements
  private floor: THREE.Mesh | null = null;
  private walls: THREE.Group | null = null;
  
  // Game state
  private localPlayerId: string | null = null;
  
  constructor() {
    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();
    
    // Set up basic scene
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Configure shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set up event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  initialize(container: HTMLElement, localPlayerId: string): void {
    this.container = container;
    this.localPlayerId = localPlayerId;
    
    // Configure renderer
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Update camera aspect ratio
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    
    // Create basic map
    this.createMap();
    
    // Start render loop
    this.animate();
  }
  
  private createMap(): void {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x999999,
      roughness: 0.8,
      metalness: 0.2
    });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
    
    // Create walls
    this.walls = new THREE.Group();
    
    // Create boundary walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.7,
      metalness: 0.1
    });
    
    // North wall
    const northWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 5, 1),
      wallMaterial
    );
    northWall.position.set(0, 2.5, -25);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    this.walls.add(northWall);
    
    // South wall
    const southWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 5, 1),
      wallMaterial
    );
    southWall.position.set(0, 2.5, 25);
    southWall.castShadow = true;
    southWall.receiveShadow = true;
    this.walls.add(southWall);
    
    // East wall
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 5, 50),
      wallMaterial
    );
    eastWall.position.set(25, 2.5, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    this.walls.add(eastWall);
    
    // West wall
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 5, 50),
      wallMaterial
    );
    westWall.position.set(-25, 2.5, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    this.walls.add(westWall);
    
    // Add some internal walls for cover
    const coverWall1 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 3, 1),
      wallMaterial
    );
    coverWall1.position.set(-5, 1.5, -10);
    coverWall1.castShadow = true;
    coverWall1.receiveShadow = true;
    this.walls.add(coverWall1);
    
    const coverWall2 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 3, 1),
      wallMaterial
    );
    coverWall2.position.set(5, 1.5, 10);
    coverWall2.castShadow = true;
    coverWall2.receiveShadow = true;
    this.walls.add(coverWall2);
    
    const coverWall3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 10),
      wallMaterial
    );
    coverWall3.position.set(-15, 1.5, 0);
    coverWall3.castShadow = true;
    coverWall3.receiveShadow = true;
    this.walls.add(coverWall3);
    
    const coverWall4 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 10),
      wallMaterial
    );
    coverWall4.position.set(15, 1.5, 0);
    coverWall4.castShadow = true;
    coverWall4.receiveShadow = true;
    this.walls.add(coverWall4);
    
    // Add some boxes for cover
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xbb5555,
      roughness: 0.5,
      metalness: 0.3
    });
    
    for (let i = 0; i < 8; i++) {
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(
        (Math.random() - 0.5) * 40,
        1,
        (Math.random() - 0.5) * 40
      );
      box.castShadow = true;
      box.receiveShadow = true;
      this.walls.add(box);
    }
    
    this.scene.add(this.walls);
    
    // Add a skybox
    const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyboxMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(skybox);
  }
  
  updatePlayers(players: Record<string, Player>): void {
    // Get the list of current player IDs
    const currentPlayerIds = new Set(Object.keys(players));
    
    // Remove meshes for players who are no longer in the game
    this.playerMeshes.forEach((mesh, playerId) => {
      if (!currentPlayerIds.has(playerId)) {
        this.scene.remove(mesh);
        this.playerMeshes.delete(playerId);
      }
    });
    
    // Update or create meshes for all current players
    Object.values(players).forEach(player => {
      // Skip if player is not alive
      if (!player.isAlive) {
        if (this.playerMeshes.has(player.id)) {
          const mesh = this.playerMeshes.get(player.id)!;
          this.scene.remove(mesh);
          this.playerMeshes.delete(player.id);
        }
        return;
      }
      
      if (this.playerMeshes.has(player.id)) {
        // Update existing player mesh
        const playerMesh = this.playerMeshes.get(player.id)!;
        this.updatePlayerMesh(playerMesh, player);
      } else {
        // Create new player mesh
        const playerMesh = this.createPlayerMesh(player);
        this.scene.add(playerMesh);
        this.playerMeshes.set(player.id, playerMesh);
      }
    });
    
    // Update camera position for local player
    if (this.localPlayerId && players[this.localPlayerId]) {
      const localPlayer = players[this.localPlayerId];
      if (localPlayer.isAlive) {
        this.updateCameraForLocalPlayer(localPlayer);
      }
    }
  }
  
  private createPlayerMesh(player: Player): THREE.Group {
    const group = new THREE.Group();
    
    // Create player body (capsule shape)
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: player.team === 'attackers' ? 0xff5555 : 0x5555ff,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Create player head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffcc88,
      roughness: 0.5,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // Create weapon (simple box)
    const weaponGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const weaponMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.2,
      metalness: 0.8
    });
    const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
    weapon.position.set(0.6, 1.4, 0);
    weapon.rotation.y = Math.PI / 2;
    group.add(weapon);
    
    // Add player name
    const nameDiv = document.createElement('div');
    nameDiv.className = 'player-name';
    nameDiv.textContent = player.username;
    nameDiv.style.color = player.team === 'attackers' ? 'red' : 'blue';
    nameDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    nameDiv.style.padding = '2px 6px';
    nameDiv.style.borderRadius = '4px';
    nameDiv.style.fontSize = '12px';
    nameDiv.style.fontWeight = 'bold';
    nameDiv.style.pointerEvents = 'none';
    
    const nameLabel = new CSS2DObject(nameDiv);
    nameLabel.position.set(0, 2.5, 0);
    group.add(nameLabel);
    
    // Set initial position
    this.updatePlayerMesh(group, player);
    
    return group;
  }
  
  private updatePlayerMesh(mesh: THREE.Group, player: Player): void {
    // Update position and rotation
    mesh.position.set(
      player.position.x,
      player.position.y,
      player.position.z
    );
    
    mesh.rotation.set(
      player.rotation.x,
      player.rotation.y,
      player.rotation.z
    );
  }
  
  private updateCameraForLocalPlayer(localPlayer: Player): void {
    // Position camera at player's head
    this.camera.position.x = localPlayer.position.x;
    this.camera.position.y = localPlayer.position.y + 0.3; // Slightly above player's head
    this.camera.position.z = localPlayer.position.z;
    
    // Set camera rotation from player rotation
    this.camera.rotation.x = localPlayer.rotation.x;
    this.camera.rotation.y = localPlayer.rotation.y;
    this.camera.rotation.z = localPlayer.rotation.z;
  }
  
  handleResize(): void {
    if (!this.container) return;
    
    // Update renderer and camera
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }
  
  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
  
  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
  
  cleanup(): void {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // Clean up renderer
    if (this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
    
    // Dispose of geometries and materials
    this.playerMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    });
    
    this.playerMeshes.clear();
  }
}

// CSS2D Renderer for player names
class CSS2DObject extends THREE.Object3D {
  private element: HTMLElement;
  
  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this.element.style.position = 'absolute';
    this.element.style.pointerEvents = 'none';
    
    const vectorPosition = new THREE.Vector3();
    const setPosition = (x: number, y: number) => {
      this.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    };
    
    this.onBeforeRender = (renderer: THREE.WebGLRenderer) => {
      const camera = renderer.camera as THREE.Camera;
      if (!camera) return;
      
      vectorPosition.setFromMatrixPosition(this.matrixWorld);
      vectorPosition.project(camera);
      
      const x = (vectorPosition.x * 0.5 + 0.5) * renderer.domElement.width;
      const y = (-vectorPosition.y * 0.5 + 0.5) * renderer.domElement.height;
      
      setPosition(x, y);
    };
    
    document.body.appendChild(this.element);
  }
}