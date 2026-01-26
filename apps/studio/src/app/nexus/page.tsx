'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  getCharacters,
  getScenes,
  getWorlds,
  getRelationships,
  getConnections,
  createRelationship,
  createConnection,
  updateCharacterPosition,
  updateScenePosition,
  updateWorldPosition,
  deleteRelationship,
  deleteConnection,
  createScene,
  createWorld,
  updateScene,
  updateWorld,
  deleteScene,
  deleteWorld,
  type Character,
  type Scene,
  type World,
  type CharacterRelationship,
  type WorldConnection,
  type CreateSceneInput,
  type CreateWorldInput,
  type UpdateSceneInput,
  type UpdateWorldInput,
} from '@/lib/api';

import { CharacterNode } from '@/components/world/CharacterNode';
import { SceneNode } from '@/components/world/SceneNode';
import { WorldNode } from '@/components/world/WorldNode';
import { RelationshipEdge } from '@/components/world/RelationshipEdge';
import { ConnectionEdge } from '@/components/world/ConnectionEdge';
import { CharacterDetailPanel } from '@/components/world/CharacterDetailPanel';
import { SceneDetailPanel } from '@/components/world/SceneDetailPanel';
import { WorldDetailPanel } from '@/components/world/WorldDetailPanel';
import { RelationshipDetailPanel } from '@/components/world/RelationshipDetailPanel';
import { NewRelationshipModal } from '@/components/world/NewRelationshipModal';
import { NewConnectionModal } from '@/components/world/NewConnectionModal';
import { NewSceneModal } from '@/components/world/NewSceneModal';
import { NewWorldModal } from '@/components/world/NewWorldModal';

type EntityType = 'character' | 'scene' | 'world';

interface SelectedEntity {
  type: EntityType;
  id: string;
}

interface SelectedRelationship {
  relationship: CharacterRelationship;
  sourceCharacter: Character;
  targetCharacter: Character;
}

interface SelectedConnection {
  connection: WorldConnection;
}

export default function WorldBuilderPage() {
  // Data state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([]);
  const [connections, setConnections] = useState<WorldConnection[]>([]);
  const [loading, setLoading] = useState(true);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [showCharacters, setShowCharacters] = useState(true);
  const [showScenes, setShowScenes] = useState(true);
  const [showWorlds, setShowWorlds] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);

  // Selection state
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<SelectedRelationship | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<SelectedConnection | null>(null);

  // Modal state
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [showWorldModal, setShowWorldModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);

  // Node types
  const nodeTypes: NodeTypes = useMemo(() => ({
    character: CharacterNode,
    scene: SceneNode,
    world: WorldNode,
  }), []);

  // Edge types
  const edgeTypes: EdgeTypes = useMemo(() => ({
    relationship: RelationshipEdge,
    connection: ConnectionEdge,
  }), []);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [chars, scns, wrlds, rels, conns] = await Promise.all([
        getCharacters(),
        getScenes(),
        getWorlds(),
        getRelationships(),
        getConnections(),
      ]);
      setCharacters(chars);
      setScenes(scns);
      setWorlds(wrlds);
      setRelationships(rels);
      setConnections(conns);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle relationship click
  const handleRelationshipClick = useCallback((relationship: CharacterRelationship) => {
    const source = characters.find(c => c.id === relationship.sourceCharacterId);
    const target = characters.find(c => c.id === relationship.targetCharacterId);
    if (source && target) {
      setSelectedEntity(null);
      setSelectedConnection(null);
      setSelectedRelationship({ relationship, sourceCharacter: source, targetCharacter: target });
    }
  }, [characters]);

  // Handle connection click
  const handleConnectionClick = useCallback((connection: WorldConnection) => {
    setSelectedEntity(null);
    setSelectedRelationship(null);
    setSelectedConnection({ connection });
  }, []);

  // Build nodes from entities
  useEffect(() => {
    const newNodes: Node[] = [];

    if (showCharacters) {
      characters.forEach((char, index) => {
        const position = char.position
          ? { x: char.position.x, y: char.position.y }
          : { x: 100 + (index % 5) * 180, y: 100 + Math.floor(index / 5) * 180 };

        newNodes.push({
          id: `character:${char.id}`,
          type: 'character',
          position,
          data: {
            character: char,
            onClick: () => {
              setSelectedRelationship(null);
              setSelectedConnection(null);
              setSelectedEntity({ type: 'character', id: char.id });
            },
          },
        });
      });
    }

    if (showScenes) {
      scenes.forEach((scene, index) => {
        const position = scene.position
          ? { x: scene.position.x, y: scene.position.y }
          : { x: 500 + (index % 5) * 180, y: 100 + Math.floor(index / 5) * 180 };

        newNodes.push({
          id: `scene:${scene.id}`,
          type: 'scene',
          position,
          data: {
            scene,
            onClick: () => {
              setSelectedRelationship(null);
              setSelectedConnection(null);
              setSelectedEntity({ type: 'scene', id: scene.id });
            },
          },
        });
      });
    }

    if (showWorlds) {
      worlds.forEach((world, index) => {
        const position = world.position
          ? { x: world.position.x, y: world.position.y }
          : { x: 300 + (index % 3) * 220, y: 400 + Math.floor(index / 3) * 220 };

        newNodes.push({
          id: `world:${world.id}`,
          type: 'world',
          position,
          data: {
            world,
            onClick: () => {
              setSelectedRelationship(null);
              setSelectedConnection(null);
              setSelectedEntity({ type: 'world', id: world.id });
            },
          },
        });
      });
    }

    setNodes(newNodes);
  }, [characters, scenes, worlds, showCharacters, showScenes, showWorlds, setNodes]);

  // Build edges from relationships and connections
  useEffect(() => {
    const newEdges: Edge[] = [];

    // Character-to-character relationships
    if (showCharacters) {
      relationships.forEach((rel) => {
        newEdges.push({
          id: `relationship:${rel.id}`,
          source: `character:${rel.sourceCharacterId}`,
          target: `character:${rel.targetCharacterId}`,
          type: 'relationship',
          data: {
            relationship: rel,
            onClick: handleRelationshipClick,
          },
        });
      });
    }

    // Cross-type connections
    connections.forEach((conn) => {
      const sourceType = conn.sourceType.toLowerCase();
      const targetType = conn.targetType.toLowerCase();

      const sourceVisible =
        (sourceType === 'character' && showCharacters) ||
        (sourceType === 'scene' && showScenes) ||
        (sourceType === 'world' && showWorlds);

      const targetVisible =
        (targetType === 'character' && showCharacters) ||
        (targetType === 'scene' && showScenes) ||
        (targetType === 'world' && showWorlds);

      if (sourceVisible && targetVisible) {
        newEdges.push({
          id: `connection:${conn.id}`,
          source: `${sourceType}:${conn.sourceId}`,
          target: `${targetType}:${conn.targetId}`,
          type: 'connection',
          data: {
            connection: conn,
            onClick: handleConnectionClick,
          },
        });
      }
    });

    setEdges(newEdges);
  }, [relationships, connections, showCharacters, showScenes, showWorlds, setEdges, handleRelationshipClick, handleConnectionClick]);

  // Handle new connection from React Flow
  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;

    const [sourceType] = params.source.split(':');
    const [targetType] = params.target.split(':');

    // Both characters = relationship
    if (sourceType === 'character' && targetType === 'character') {
      setPendingConnection({ source: params.source, target: params.target });
      setShowRelationshipModal(true);
    } else {
      // Cross-type = connection
      setPendingConnection({ source: params.source, target: params.target });
      setShowConnectionModal(true);
    }
  }, []);

  // Handle node drag end to save position
  const onNodeDragStop = useCallback(async (_event: React.MouseEvent, node: Node) => {
    const [type, id] = node.id.split(':');
    const { x, y } = node.position;

    try {
      if (type === 'character') {
        await updateCharacterPosition(id, x, y);
      } else if (type === 'scene') {
        await updateScenePosition(id, x, y);
      } else if (type === 'world') {
        await updateWorldPosition(id, x, y);
      }
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  }, []);

  // Handle creating relationship
  const handleCreateRelationship = async (type: string, lore: string) => {
    if (!pendingConnection) return;

    const sourceId = pendingConnection.source.split(':')[1];
    const targetId = pendingConnection.target.split(':')[1];

    await createRelationship({
      sourceCharacterId: sourceId,
      targetCharacterId: targetId,
      relationshipType: type,
      lore,
    });

    await loadData();
    setShowRelationshipModal(false);
    setPendingConnection(null);
  };

  // Handle creating connection
  const handleCreateConnection = async (connectionType: string, lore: string) => {
    if (!pendingConnection) return;

    const [sourceType, sourceId] = pendingConnection.source.split(':');
    const [targetType, targetId] = pendingConnection.target.split(':');

    await createConnection({
      sourceType: sourceType.toUpperCase() as 'CHARACTER' | 'SCENE' | 'WORLD',
      sourceId,
      targetType: targetType.toUpperCase() as 'CHARACTER' | 'SCENE' | 'WORLD',
      targetId,
      connectionType,
      lore,
    });

    await loadData();
    setShowConnectionModal(false);
    setPendingConnection(null);
  };

  // Handle creating scene
  const handleCreateScene = async (data: CreateSceneInput) => {
    await createScene(data);
    await loadData();
  };

  // Handle creating world
  const handleCreateWorld = async (data: CreateWorldInput) => {
    await createWorld(data);
    await loadData();
  };

  // Handle updating scene
  const handleUpdateScene = async (id: string, data: UpdateSceneInput) => {
    await updateScene(id, data);
    await loadData();
    setSelectedEntity(null);
  };

  // Handle updating world
  const handleUpdateWorld = async (id: string, data: UpdateWorldInput) => {
    await updateWorld(id, data);
    await loadData();
    setSelectedEntity(null);
  };

  // Handle deleting scene
  const handleDeleteScene = async (id: string) => {
    await deleteScene(id);
    await loadData();
    setSelectedEntity(null);
  };

  // Handle deleting world
  const handleDeleteWorld = async (id: string) => {
    await deleteWorld(id);
    await loadData();
    setSelectedEntity(null);
  };

  // Handle deleting relationship
  const handleDeleteRelationship = async (id: string) => {
    await deleteRelationship(id);
    await loadData();
    setSelectedRelationship(null);
  };

  // Handle deleting connection
  const handleDeleteConnection = async (id: string) => {
    await deleteConnection(id);
    await loadData();
    setSelectedConnection(null);
  };

  // Get selected entity data
  const getSelectedCharacter = () => {
    if (selectedEntity?.type === 'character') {
      return characters.find(c => c.id === selectedEntity.id);
    }
    return null;
  };

  const getSelectedScene = () => {
    if (selectedEntity?.type === 'scene') {
      return scenes.find(s => s.id === selectedEntity.id);
    }
    return null;
  };

  const getSelectedWorld = () => {
    if (selectedEntity?.type === 'world') {
      return worlds.find(w => w.id === selectedEntity.id);
    }
    return null;
  };

  const selectedCharacter = getSelectedCharacter();
  const selectedScene = getSelectedScene();
  const selectedWorld = getSelectedWorld();

  // Determine if anything is selected for the right panel
  const hasSelection = selectedCharacter || selectedScene || selectedWorld || selectedRelationship || selectedConnection;

  if (loading) {
    return (
      <div className="world-page">
        <div className="loading-message">Loading world...</div>
      </div>
    );
  }

  return (
    <div className="world-page">
      {/* Left Sidebar */}
      <div className="world-sidebar">
        <h1 className="sidebar-title">Nexus</h1>

        {/* Visibility Toggles */}
        <div className="sidebar-section">
          <h3 className="section-title">Show</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showCharacters}
                onChange={(e) => setShowCharacters(e.target.checked)}
              />
              <span>Characters ({characters.length})</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showScenes}
                onChange={(e) => setShowScenes(e.target.checked)}
              />
              <span>Scenes ({scenes.length})</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showWorlds}
                onChange={(e) => setShowWorlds(e.target.checked)}
              />
              <span>Globes ({worlds.length})</span>
            </label>
          </div>
        </div>

        {/* Grid Settings */}
        <div className="sidebar-section">
          <h3 className="section-title">Grid</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <span>Show Grid</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
              />
              <span>Snap to Grid</span>
            </label>
          </div>
        </div>

        {/* Add Buttons */}
        <div className="sidebar-section">
          <h3 className="section-title">Add</h3>
          <div className="add-buttons">
            <button className="btn btn-sm btn-scene" onClick={() => setShowSceneModal(true)}>
              + Scene
            </button>
            <button className="btn btn-sm btn-world" onClick={() => setShowWorldModal(true)}>
              + Globe
            </button>
          </div>
        </div>

        {/* Entity Lists */}
        {showCharacters && characters.length > 0 && (
          <div className="sidebar-section">
            <h3 className="section-title">Characters</h3>
            <ul className="entity-list">
              {characters.map((char) => (
                <li
                  key={char.id}
                  className={`entity-item entity-character ${selectedEntity?.id === char.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRelationship(null);
                    setSelectedConnection(null);
                    setSelectedEntity({ type: 'character', id: char.id });
                  }}
                >
                  {char.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showScenes && scenes.length > 0 && (
          <div className="sidebar-section">
            <h3 className="section-title">Scenes</h3>
            <ul className="entity-list">
              {scenes.map((scene) => (
                <li
                  key={scene.id}
                  className={`entity-item entity-scene ${selectedEntity?.id === scene.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRelationship(null);
                    setSelectedConnection(null);
                    setSelectedEntity({ type: 'scene', id: scene.id });
                  }}
                >
                  {scene.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showWorlds && worlds.length > 0 && (
          <div className="sidebar-section">
            <h3 className="section-title">Globes</h3>
            <ul className="entity-list">
              {worlds.map((world) => (
                <li
                  key={world.id}
                  className={`entity-item entity-world ${selectedEntity?.id === world.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRelationship(null);
                    setSelectedConnection(null);
                    setSelectedEntity({ type: 'world', id: world.id });
                  }}
                >
                  {world.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="world-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          fitView
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls />
          {showGrid && <Background variant={BackgroundVariant.Dots} gap={20} size={1} />}
        </ReactFlow>
      </div>

      {/* Right Panel */}
      <div className="right-panel-container">
        {selectedCharacter && (
          <CharacterDetailPanel
            character={selectedCharacter}
            onClose={() => setSelectedEntity(null)}
          />
        )}
        {selectedScene && (
          <SceneDetailPanel
            scene={selectedScene}
            onClose={() => setSelectedEntity(null)}
            onUpdate={handleUpdateScene}
            onDelete={handleDeleteScene}
          />
        )}
        {selectedWorld && (
          <WorldDetailPanel
            world={selectedWorld}
            onClose={() => setSelectedEntity(null)}
            onUpdate={handleUpdateWorld}
            onDelete={handleDeleteWorld}
          />
        )}
        {selectedRelationship && (
          <RelationshipDetailPanel
            relationship={selectedRelationship.relationship}
            sourceCharacter={selectedRelationship.sourceCharacter}
            targetCharacter={selectedRelationship.targetCharacter}
            onClose={() => setSelectedRelationship(null)}
            onDelete={handleDeleteRelationship}
          />
        )}
        {!hasSelection && (
          <div className="default-panel">
            <h2 className="panel-title">Nexus Overview</h2>
            <div className="default-panel-content">
              <div className="stat-item">
                <span className="stat-label">Characters</span>
                <span className="stat-value">{characters.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Scenes</span>
                <span className="stat-value">{scenes.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Globes</span>
                <span className="stat-value">{worlds.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Relationships</span>
                <span className="stat-value">{relationships.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Connections</span>
                <span className="stat-value">{connections.length}</span>
              </div>
            </div>
            <p className="panel-hint">
              Select a node or edge to view details. Drag between nodes to create connections.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewRelationshipModal
        isOpen={showRelationshipModal}
        onClose={() => {
          setShowRelationshipModal(false);
          setPendingConnection(null);
        }}
        onCreate={handleCreateRelationship}
        sourceCharacter={
          pendingConnection
            ? characters.find(c => c.id === pendingConnection.source.split(':')[1])
            : undefined
        }
        targetCharacter={
          pendingConnection
            ? characters.find(c => c.id === pendingConnection.target.split(':')[1])
            : undefined
        }
      />

      <NewConnectionModal
        isOpen={showConnectionModal}
        onClose={() => {
          setShowConnectionModal(false);
          setPendingConnection(null);
        }}
        onCreate={handleCreateConnection}
        sourceType={pendingConnection?.source.split(':')[0] as EntityType}
        targetType={pendingConnection?.target.split(':')[0] as EntityType}
      />

      <NewSceneModal
        isOpen={showSceneModal}
        onClose={() => setShowSceneModal(false)}
        onCreate={handleCreateScene}
      />

      <NewWorldModal
        isOpen={showWorldModal}
        onClose={() => setShowWorldModal(false)}
        onCreate={handleCreateWorld}
      />
    </div>
  );
}
