'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getCharacters, type Character } from '@/lib/api';

const STORAGE_KEY = 'ophelian-world-state';

interface NodeData {
  id: string;
  characterId: string | null;
  character: Character | null;
  x: number;
  y: number;
  color: string;
}

interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: RelationshipType;
  lore?: string;
}

type RelationshipType =
  | 'lover'
  | 'mentor'
  | 'rival'
  | 'sibling'
  | 'ally'
  | 'enemy'
  | 'protector'
  | 'betrayer'
  | 'creator'
  | 'vessel';

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string; color: string }[] = [
  { value: 'lover', label: 'Lover', color: '#e91e63' },
  { value: 'mentor', label: 'Mentor', color: '#2196f3' },
  { value: 'rival', label: 'Rival', color: '#ff9800' },
  { value: 'sibling', label: 'Sibling', color: '#9c27b0' },
  { value: 'ally', label: 'Ally', color: '#4caf50' },
  { value: 'enemy', label: 'Enemy', color: '#f44336' },
  { value: 'protector', label: 'Protector', color: '#00bcd4' },
  { value: 'betrayer', label: 'Betrayer', color: '#795548' },
  { value: 'creator', label: 'Creator', color: '#ffc107' },
  { value: 'vessel', label: 'Vessel', color: '#607d8b' },
];

const NODE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#10b981', '#06b6d4', '#f59e0b', '#84cc16',
];

function generateRelationshipLore(char1: Character, char2: Character, relType: RelationshipType): string {
  const templates: Record<RelationshipType, string[]> = {
    lover: [
      `${char1.name} and ${char2.name} share a bond forged in the crucible of fate. Their love defies the boundaries set by their origins.`,
      `What began as a chance encounter between ${char1.name} and ${char2.name} blossomed into an all-consuming passion.`,
    ],
    mentor: [
      `${char1.name} took ${char2.name} under their wing when all others had abandoned hope.`,
      `The wisdom of ${char1.name} flows through ${char2.name} like a river through ancient stone.`,
    ],
    rival: [
      `${char1.name} and ${char2.name} circle each other like twin stars, their competition driving both to greater heights.`,
      `The rivalry between ${char1.name} and ${char2.name} is legendary.`,
    ],
    sibling: [
      `Born of the same bloodline, ${char1.name} and ${char2.name} carry the weight of their shared heritage.`,
      `${char1.name} and ${char2.name} grew up in the same halls, their fates intertwined from the first breath.`,
    ],
    ally: [
      `${char1.name} and ${char2.name} stand together against the darkness.`,
      `When ${char1.name} called, ${char2.name} answered. Their partnership has weathered many storms.`,
    ],
    enemy: [
      `The enmity between ${char1.name} and ${char2.name} burns with the fury of a thousand suns.`,
      `${char1.name} will never forgive what ${char2.name} has done.`,
    ],
    protector: [
      `${char1.name} has sworn to shield ${char2.name} from all harm.`,
      `Where ${char2.name} walks, ${char1.name} watches.`,
    ],
    betrayer: [
      `${char1.name} once held ${char2.name}'s complete trust. That trust was shattered.`,
      `The betrayal of ${char1.name} left ${char2.name} questioning everything.`,
    ],
    creator: [
      `${char1.name} shaped ${char2.name} from the raw stuff of possibility.`,
      `${char2.name} owes their very existence to ${char1.name}.`,
    ],
    vessel: [
      `${char1.name} carries within them a fragment of ${char2.name}'s essence.`,
      `${char2.name} chose ${char1.name} as their vessel.`,
    ],
  };
  const options = templates[relType];
  return options[Math.floor(Math.random() * options.length)];
}

interface SavedWorldState {
  nodes: Array<{
    id: string;
    characterId: string | null;
    x: number;
    y: number;
    color: string;
  }>;
  connections: Connection[];
}

const DEFAULT_NODES: NodeData[] = [
  { id: 'node-1', characterId: null, character: null, x: 250, y: 150, color: NODE_COLORS[0] },
  { id: 'node-2', characterId: null, character: null, x: 450, y: 250, color: NODE_COLORS[1] },
  { id: 'node-3', characterId: null, character: null, x: 250, y: 400, color: NODE_COLORS[2] },
  { id: 'node-4', characterId: null, character: null, x: 100, y: 250, color: NODE_COLORS[3] },
];

export default function WorldPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [nodes, setNodes] = useState<NodeData[]>(DEFAULT_NODES);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  // Connection drawing state (shift+drag)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // UI state
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [generatedLore, setGeneratedLore] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load characters and saved state on mount
  useEffect(() => {
    loadCharacters();
  }, []);

  // Hydrate nodes with character data after characters load
  useEffect(() => {
    if (characters.length > 0 && !isHydrated) {
      loadSavedState();
      setIsHydrated(true);
    }
  }, [characters, isHydrated]);

  // Save state whenever nodes or connections change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveState();
    }
  }, [nodes, connections, isHydrated]);

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: SavedWorldState = JSON.parse(saved);

        // Restore nodes with character data
        const restoredNodes: NodeData[] = state.nodes.map((savedNode) => {
          const character = savedNode.characterId
            ? characters.find((c) => c.id === savedNode.characterId) || null
            : null;
          return {
            ...savedNode,
            character,
          };
        });

        setNodes(restoredNodes);
        setConnections(state.connections);
      }
    } catch (err) {
      console.error('Failed to load saved world state:', err);
    }
  };

  const saveState = () => {
    try {
      const state: SavedWorldState = {
        nodes: nodes.map((node) => ({
          id: node.id,
          characterId: node.characterId,
          x: node.x,
          y: node.y,
          color: node.color,
        })),
        connections,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save world state:', err);
    }
  };

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const chars = await getCharacters();
      setCharacters(chars);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeCharacterChange = (nodeId: string, characterId: string | null) => {
    const character = characterId ? characters.find((c) => c.id === characterId) || null : null;
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, characterId, character } : node))
    );
    if (!characterId) {
      setConnections((prev) =>
        prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
      );
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Shift+drag = connect
    if (e.shiftKey && node.character) {
      setConnectingFromId(nodeId);
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      return;
    }

    // Normal drag = move
    setDraggingNodeId(nodeId);
    setHasDragged(false);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (draggingNodeId) {
        setHasDragged(true);
        setNodes((prev) =>
          prev.map((node) =>
            node.id === draggingNodeId
              ? {
                  ...node,
                  x: Math.max(60, Math.min(rect.width - 60, x - dragOffset.x)),
                  y: Math.max(60, Math.min(rect.height - 60, y - dragOffset.y)),
                }
              : node
          )
        );
      }

      if (connectingFromId) {
        setMousePos({ x, y });
      }
    },
    [draggingNodeId, dragOffset, connectingFromId]
  );

  const handleMouseUp = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    // Handle shift+drag connection
    if (connectingFromId) {
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find target node
        const targetNode = nodes.find((node) => {
          if (node.id === connectingFromId) return false;
          if (!node.character) return false;
          const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
          return dist < 60;
        });

        if (targetNode) {
          const existing = connections.find(
            (c) =>
              (c.fromNodeId === connectingFromId && c.toNodeId === targetNode.id) ||
              (c.fromNodeId === targetNode.id && c.toNodeId === connectingFromId)
          );

          if (!existing) {
            const newConnection: Connection = {
              id: `conn-${Date.now()}`,
              fromNodeId: connectingFromId,
              toNodeId: targetNode.id,
              type: 'ally',
            };
            setConnections((prev) => [...prev, newConnection]);
            setSelectedConnection(newConnection);
            setGeneratedLore(null);
            setShowLoreModal(true);
          } else {
            setSelectedConnection(existing);
            setGeneratedLore(existing.lore || null);
            setShowLoreModal(true);
          }
        }
      }
    }

    // Handle drag to swap characters or click to edit
    if (draggingNodeId && rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const draggedNode = nodes.find((n) => n.id === draggingNodeId);

      if (hasDragged) {
        // Find if we dropped on another node
        const targetNode = nodes.find((node) => {
          if (node.id === draggingNodeId) return false;
          const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
          return dist < 70;
        });

        if (targetNode && draggedNode) {
          // Swap the characters between the two nodes
          setNodes((prev) =>
            prev.map((node) => {
              if (node.id === draggingNodeId) {
                return {
                  ...node,
                  characterId: targetNode.characterId,
                  character: targetNode.character,
                  // Reset position to where it was before (don't overlap)
                  x: draggedNode.x,
                  y: draggedNode.y,
                };
              }
              if (node.id === targetNode.id) {
                return {
                  ...node,
                  characterId: draggedNode.characterId,
                  character: draggedNode.character,
                };
              }
              return node;
            })
          );
        }
      } else if (draggedNode?.character) {
        // It was a click, not a drag - open edit modal
        setEditingNodeId(draggingNodeId);
      }
    }

    setDraggingNodeId(null);
    setConnectingFromId(null);
    setHasDragged(false);
  };

  const handleConnectionClick = (connection: Connection) => {
    setSelectedConnection(connection);
    setGeneratedLore(connection.lore || null);
    setShowLoreModal(true);
  };

  const handleRelationshipTypeChange = (connId: string, type: RelationshipType) => {
    setConnections((prev) => prev.map((c) => (c.id === connId ? { ...c, type } : c)));
    if (selectedConnection?.id === connId) {
      setSelectedConnection((prev) => (prev ? { ...prev, type } : null));
    }
  };

  const handleGenerateLore = () => {
    if (!selectedConnection) return;
    const fromNode = nodes.find((n) => n.id === selectedConnection.fromNodeId);
    const toNode = nodes.find((n) => n.id === selectedConnection.toNodeId);
    if (!fromNode?.character || !toNode?.character) return;

    const lore = generateRelationshipLore(fromNode.character, toNode.character, selectedConnection.type);
    setGeneratedLore(lore);
    setConnections((prev) =>
      prev.map((c) => (c.id === selectedConnection.id ? { ...c, lore } : c))
    );
  };

  const handleRandomizeAll = () => {
    const activeNodes = nodes.filter((n) => n.character);
    if (activeNodes.length < 2) {
      alert('Need at least 2 characters to randomize connections');
      return;
    }

    const newConnections: Connection[] = [];
    for (let i = 0; i < activeNodes.length; i++) {
      for (let j = i + 1; j < activeNodes.length; j++) {
        newConnections.push({
          id: `conn-${Date.now()}-${i}-${j}`,
          fromNodeId: activeNodes[i].id,
          toNodeId: activeNodes[j].id,
          type: RELATIONSHIP_TYPES[Math.floor(Math.random() * RELATIONSHIP_TYPES.length)].value,
        });
      }
    }
    setConnections(newConnections);
  };

  const handleDeleteConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
    setShowLoreModal(false);
    setSelectedConnection(null);
  };

  const addNewNode = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      characterId: null,
      character: null,
      x: rect ? rect.width / 2 + (Math.random() - 0.5) * 200 : 300,
      y: rect ? rect.height / 2 + (Math.random() - 0.5) * 200 : 300,
      color: NODE_COLORS[nodes.length % NODE_COLORS.length],
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const removeNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    );
  };

  const clearWorld = () => {
    if (window.confirm('Are you sure you want to clear the entire world? This will remove all nodes and connections.')) {
      setNodes(DEFAULT_NODES);
      setConnections([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getConnectionColor = (connection: Connection): string => {
    return RELATIONSHIP_TYPES.find((t) => t.value === connection.type)?.color || '#666';
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <p style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'system-ui, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', border: '1px solid #f44336' }}>
          <p style={{ color: '#f44336', marginBottom: '1rem', fontFamily: 'system-ui, sans-serif' }}>{error}</p>
          <button
            onClick={loadCharacters}
            style={{
              padding: '0.5rem 1rem',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0f', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(10, 10, 15, 0.95)',
          borderBottom: '1px solid #222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>
            &larr; Back
          </a>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
            World Builder
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: '#4caf50', fontSize: '0.75rem', fontFamily: 'system-ui, sans-serif' }}>
            Auto-saved
          </span>
          <button
            onClick={clearWorld}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#f44336',
              border: '1px solid #f44336',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Clear World
          </button>
          <button
            onClick={addNewNode}
            style={{
              padding: '0.5rem 1rem',
              background: '#222',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            + Add Node
          </button>
          <button
            onClick={handleRandomizeAll}
            style={{
              padding: '0.5rem 1rem',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Randomize All
          </button>
        </div>
      </div>

      {/* Shortcuts Panel - Left Side */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          bottom: 0,
          width: '240px',
          background: 'rgba(15, 15, 26, 0.95)',
          borderRight: '1px solid #222',
          padding: '1.5rem',
          overflowY: 'auto',
          zIndex: 50,
        }}
      >
        <h2 style={{ color: '#fff', fontSize: '0.875rem', marginBottom: '1.5rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
          SHORTCUTS
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#6366f1', fontSize: '0.7rem', marginBottom: '0.75rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
            NODES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ShortcutItem keys={['Click']} description="Change character" />
            <ShortcutItem keys={['Drag']} description="Move node" />
            <ShortcutItem keys={['Drag onto']} description="Swap characters" />
            <ShortcutItem keys={['Shift', 'Drag']} description="Connect nodes" />
            <ShortcutItem keys={['Click', 'x']} description="Remove node" />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#6366f1', fontSize: '0.7rem', marginBottom: '0.75rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
            CONNECTIONS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ShortcutItem keys={['Click line']} description="Edit relationship" />
            <ShortcutItem keys={['In modal']} description="Change type & lore" />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#6366f1', fontSize: '0.7rem', marginBottom: '0.75rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
            ACTIONS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ShortcutItem keys={['+ Add Node']} description="Create new node" />
            <ShortcutItem keys={['Randomize']} description="Auto-connect all" />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <h3 style={{ color: '#6366f1', fontSize: '0.7rem', marginBottom: '0.75rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
            CONNECTIONS ({connections.length})
          </h3>
          {connections.length === 0 ? (
            <p style={{ color: '#555', fontSize: '0.75rem', fontFamily: 'system-ui, sans-serif' }}>
              No connections yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
                const toNode = nodes.find((n) => n.id === conn.toNodeId);
                if (!fromNode?.character || !toNode?.character) return null;

                return (
                  <div
                    key={conn.id}
                    onClick={() => handleConnectionClick(conn)}
                    style={{
                      padding: '0.5rem',
                      background: selectedConnection?.id === conn.id ? '#252538' : 'transparent',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: selectedConnection?.id === conn.id ? '1px solid #6366f1' : '1px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: getConnectionColor(conn),
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: '#ccc', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif' }}>
                        {fromNode.character.name.split(' ')[0]} & {toNode.character.name.split(' ')[0]}
                      </span>
                    </div>
                    <span style={{ color: '#666', fontSize: '0.65rem', textTransform: 'capitalize', marginLeft: '12px', fontFamily: 'system-ui, sans-serif' }}>
                      {conn.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '60px',
          left: '240px',
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, #12121a 0%, #0a0a0f 100%)',
          cursor: draggingNodeId ? 'grabbing' : connectingFromId ? 'crosshair' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const color = getConnectionColor(conn);

            return (
              <g key={conn.id} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => handleConnectionClick(conn)}>
                <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={color} strokeWidth="3" />
                <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="transparent" strokeWidth="20" />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  textAnchor="middle"
                  fill={color}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                  style={{ textTransform: 'uppercase', pointerEvents: 'none' }}
                >
                  {conn.type}
                </text>
              </g>
            );
          })}

          {/* Drawing connection line */}
          {connectingFromId && (() => {
            const fromNode = nodes.find((n) => n.id === connectingFromId);
            if (!fromNode) return null;
            return (
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#6366f1"
                strokeWidth="3"
                strokeDasharray="8,4"
              />
            );
          })()}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x - 55,
              top: node.y - 55,
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: node.character
                ? `linear-gradient(135deg, ${node.color} 0%, ${node.color}bb 100%)`
                : 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
              border: `3px solid ${node.character ? node.color : '#333'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: draggingNodeId === node.id ? 'grabbing' : 'grab',
              boxShadow: node.character
                ? `0 0 40px ${node.color}40, inset 0 -20px 40px rgba(0,0,0,0.3)`
                : '0 4px 20px rgba(0,0,0,0.5), inset 0 -20px 40px rgba(0,0,0,0.3)',
              userSelect: 'none',
              zIndex: draggingNodeId === node.id ? 100 : 10,
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
          >
            {node.character ? (
              <>
                {node.character.avatarUrl ? (
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundImage: `url(${node.character.avatarUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: node.character.avatarPosition || 'center',
                      border: '2px solid rgba(255,255,255,0.4)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {node.character.name.charAt(0)}
                  </div>
                )}
                <span
                  style={{
                    fontSize: '0.75rem',
                    marginTop: '6px',
                    textAlign: 'center',
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'system-ui, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {node.character.name}
                </span>
              </>
            ) : (
              <select
                style={{
                  width: '80px',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#1a1a2e',
                  color: '#fff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                }}
                value=""
                onChange={(e) => handleNodeCharacterChange(node.id, e.target.value || null)}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <option value="">+ Add</option>
                {characters
                  .filter((c) => !nodes.some((n) => n.characterId === c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            )}

            {/* Remove button */}
            {(node.character || nodes.length > 2) && (
              <button
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#f44336',
                  color: '#fff',
                  border: '2px solid #0a0a0f',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'system-ui, sans-serif',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (node.character) {
                    handleNodeCharacterChange(node.id, null);
                  } else {
                    removeNode(node.id);
                  }
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lore Modal */}
      {showLoreModal && selectedConnection && (() => {
        const fromNode = nodes.find((n) => n.id === selectedConnection.fromNodeId);
        const toNode = nodes.find((n) => n.id === selectedConnection.toNodeId);
        if (!fromNode?.character || !toNode?.character) return null;

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowLoreModal(false)}
          >
            <div
              style={{
                width: '500px',
                maxHeight: '80vh',
                overflow: 'auto',
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #333',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.125rem', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                  {fromNode.character.name} & {toNode.character.name}
                </h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
                  onClick={() => setShowLoreModal(false)}
                >
                  x
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
                  RELATIONSHIP TYPE
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <button
                      key={type.value}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        background: selectedConnection.type === type.value ? type.color : '#252538',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                      onClick={() => handleRelationshipTypeChange(selectedConnection.id, type.value)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
                    LORE
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleGenerateLore}
                      style={{
                        padding: '0.3rem 0.75rem',
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      Generate from Relationship
                    </button>
                    <button
                      onClick={() => {
                        const randomLore = `${fromNode.character!.name} and ${toNode.character!.name} crossed paths under mysterious circumstances. Their story is yet to be written...`;
                        setGeneratedLore(randomLore);
                        setConnections((prev) =>
                          prev.map((c) => (c.id === selectedConnection.id ? { ...c, lore: randomLore } : c))
                        );
                      }}
                      style={{
                        padding: '0.3rem 0.75rem',
                        background: '#252538',
                        color: '#fff',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      Random Prompt
                    </button>
                  </div>
                </div>
                <textarea
                  value={generatedLore || ''}
                  onChange={(e) => {
                    const newLore = e.target.value;
                    setGeneratedLore(newLore);
                    setConnections((prev) =>
                      prev.map((c) => (c.id === selectedConnection.id ? { ...c, lore: newLore } : c))
                    );
                  }}
                  placeholder="Write your lore here, or use the buttons above to generate..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '1rem',
                    background: '#252538',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    fontFamily: 'system-ui, sans-serif',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleDeleteConnection(selectedConnection.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: '#f44336',
                    border: '1px solid #f44336',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  Delete Connection
                </button>
                <button
                  onClick={() => setShowLoreModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Change Character Modal */}
      {editingNodeId && (() => {
        const node = nodes.find((n) => n.id === editingNodeId);
        if (!node) return null;

        const availableCharacters = characters.filter(
          (c) => c.id === node.characterId || !nodes.some((n) => n.characterId === c.id)
        );

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setEditingNodeId(null)}
          >
            <div
              style={{
                width: '400px',
                maxHeight: '80vh',
                overflow: 'auto',
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #333',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.125rem', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                  Change Character
                </h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
                  onClick={() => setEditingNodeId(null)}
                >
                  x
                </button>
              </div>

              {node.character && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#252538', borderRadius: '8px' }}>
                  <span style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif' }}>CURRENT</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {node.character.avatarUrl ? (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundImage: `url(${node.character.avatarUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: node.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontFamily: 'system-ui, sans-serif',
                        }}
                      >
                        {node.character.name.charAt(0)}
                      </div>
                    )}
                    <span style={{ color: '#fff', fontFamily: 'system-ui, sans-serif' }}>{node.character.name}</span>
                  </div>
                </div>
              )}

              <div>
                <span style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif' }}>SELECT CHARACTER</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {/* Option to remove character */}
                  <button
                    onClick={() => {
                      handleNodeCharacterChange(editingNodeId, null);
                      setEditingNodeId(null);
                    }}
                    style={{
                      padding: '0.75rem',
                      background: 'transparent',
                      border: '1px solid #f44336',
                      borderRadius: '8px',
                      color: '#f44336',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '0.875rem',
                    }}
                  >
                    Remove Character
                  </button>

                  {availableCharacters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        handleNodeCharacterChange(editingNodeId, char.id);
                        setEditingNodeId(null);
                      }}
                      style={{
                        padding: '0.75rem',
                        background: char.id === node.characterId ? '#6366f1' : '#252538',
                        border: char.id === node.characterId ? '1px solid #6366f1' : '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      {char.avatarUrl ? (
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundImage: `url(${char.avatarUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontFamily: 'system-ui, sans-serif',
                            flexShrink: 0,
                          }}
                        >
                          {char.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem' }}>{char.name}</div>
                        {char.bio && (
                          <div style={{ color: '#888', fontSize: '0.75rem', fontFamily: 'system-ui, sans-serif', marginTop: '0.15rem' }}>
                            {char.bio.slice(0, 50)}{char.bio.length > 50 ? '...' : ''}
                          </div>
                        )}
                      </div>
                      {char.id === node.characterId && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
                          Current
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Shortcut Item Component
function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {keys.map((key, i) => (
          <span key={i}>
            <kbd
              style={{
                padding: '0.2rem 0.4rem',
                background: '#252538',
                borderRadius: '4px',
                fontSize: '0.65rem',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
                border: '1px solid #333',
              }}
            >
              {key}
            </kbd>
            {i < keys.length - 1 && <span style={{ color: '#444', margin: '0 0.15rem' }}>+</span>}
          </span>
        ))}
      </div>
      <span style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif' }}>{description}</span>
    </div>
  );
}
