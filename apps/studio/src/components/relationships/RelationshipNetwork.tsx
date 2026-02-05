/**
 * Relationship Network Component
 * Visual graph/network representation of character relationships
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Relationship } from '@lcos/shared';
import styles from './RelationshipNetwork.module.css';

interface RelationshipNetworkProps {
  characterId: string;
  relationships: Relationship[];
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isMain: boolean;
}

interface Edge {
  source: string;
  target: string;
  relationship: Relationship;
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  FRIEND: '#64ffda',
  RIVAL: '#ff6b6b',
  MENTOR: '#ffd700',
  STUDENT: '#4facfe',
  FAMILY: '#f093fb',
  ROMANTIC: '#ff6b9d',
  ENEMY: '#ff4444',
  ALLY: '#00f2fe',
  NEUTRAL: '#a8b2d1',
};

export function RelationshipNetwork({ characterId, relationships }: RelationshipNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const animationRef = useRef<number>();

  // Initialize nodes and edges
  useEffect(() => {
    const characterIds = new Set<string>([characterId]);
    relationships.forEach((rel) => {
      characterIds.add(rel.characterAId);
      characterIds.add(rel.characterBId);
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    const newNodes: Node[] = [];
    const characterArray = Array.from(characterIds);

    characterArray.forEach((id, index) => {
      const isMain = id === characterId;
      const angle = (index / characterArray.length) * 2 * Math.PI;
      const distance = isMain ? 0 : radius;

      newNodes.push({
        id,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: isMain ? 40 : 30,
        isMain,
      });
    });

    const newEdges: Edge[] = relationships.map((rel) => ({
      source: rel.characterAId,
      target: rel.characterBId,
      relationship: rel,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [characterId, relationships]);

  // Physics simulation
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply forces
      const updatedNodes = nodes.map((node, i) => {
        if (node.isMain) return node; // Main node stays fixed

        let fx = 0;
        let fy = 0;

        // Spring force to center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          fx += (dx / dist) * 0.1;
          fy += (dy / dist) * 0.1;
        }

        // Repulsion from other nodes
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 150) {
            const force = 50 / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        });

        // Apply velocity and damping
        const newVx = (node.vx + fx) * 0.9;
        const newVy = (node.vy + fy) * 0.9;

        return {
          ...node,
          x: node.x + newVx,
          y: node.y + newVy,
          vx: newVx,
          vy: newVy,
        };
      });

      setNodes(updatedNodes);

      // Draw edges
      edges.forEach((edge) => {
        const sourceNode = updatedNodes.find((n) => n.id === edge.source);
        const targetNode = updatedNodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        const color = RELATIONSHIP_COLORS[edge.relationship.relationshipType] || '#a8b2d1';
        const width = (edge.relationship.strength / 100) * 5 + 1;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw nodes
      updatedNodes.forEach((node) => {
        const isHovered = hoveredNode === node.id;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.isMain
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#667eea' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = node.isMain ? 'bold 14px sans-serif' : '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = node.id.length > 10 ? node.id.substring(0, 10) + '...' : node.id;
        ctx.fillText(label, node.x, node.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isRunning = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges, hoveredNode]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.max(500, container.clientHeight);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Handle mouse hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredNode = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    setHoveredNode(hoveredNode?.id || null);

    if (hoveredNode) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  };

  // Handle click on node
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    if (clickedNode) {
      // Find relationship with this node
      const relationship = relationships.find(
        (rel) =>
          (rel.characterAId === characterId && rel.characterBId === clickedNode.id) ||
          (rel.characterBId === characterId && rel.characterAId === clickedNode.id)
      );
      setSelectedRelationship(relationship || null);
    } else {
      setSelectedRelationship(null);
    }
  };

  if (relationships.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🕸️</div>
        <p className={styles.emptyText}>No relationships to visualize</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {selectedRelationship && (
        <div className={styles.infoPanel}>
          <div className={styles.infoPanelHeader}>
            <h4 className={styles.infoPanelTitle}>Relationship Details</h4>
            <button onClick={() => setSelectedRelationship(null)} className={styles.infoPanelClose}>
              ×
            </button>
          </div>
          <div className={styles.infoPanelContent}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Type:</span>
              <span className={styles.infoValue}>{selectedRelationship.relationshipType}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Strength:</span>
              <span className={styles.infoValue}>{selectedRelationship.strength}%</span>
            </div>
            {selectedRelationship.description && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Description:</span>
                <p className={styles.infoDescription}>{selectedRelationship.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.legend}>
        <h5 className={styles.legendTitle}>Relationship Types</h5>
        <div className={styles.legendItems}>
          {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
            <div key={type} className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: color }} />
              <span className={styles.legendLabel}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
