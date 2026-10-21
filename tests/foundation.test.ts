import { describe, it, expect } from 'vitest';
import { FEATURE_INVENTORY } from '../src/data/featureInventory';
import fs from 'node:fs';
import path from 'node:path';

describe('Alche-Me Foundation Test Suite', () => {
  it('should have a valid, well-formed vertical slice feature inventory', () => {
    expect(FEATURE_INVENTORY.length).toBeGreaterThan(0);
    
    for (const item of FEATURE_INVENTORY) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.phase).toBeTruthy();
      expect(['implemented_in_prototype', 'foundational_in_place', 'in_progress', 'planned']).toContain(item.status);
    }
  });

  it('should explicitly track all core vertical slice modules from the prototype', () => {
    const ids = FEATURE_INVENTORY.map(f => f.id);
    expect(ids).toContain('periodic-table-grid');
    expect(ids).toContain('mriirs-lab-practicals');
    expect(ids).toContain('vsepr-presets');
    expect(ids).toContain('3d-molecule-viewer');
    expect(ids).toContain('rdkit-backend');
  });

  it('should define the standard Master Specification design tokens in index.css', () => {
    const cssPath = path.resolve(__dirname, '../src/index.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('--cq-bg: #101317');
    expect(cssContent).toContain('--cq-surface: #171c22');
    expect(cssContent).toContain('--cq-border: #303944');
    expect(cssContent).toContain('--cq-text: #f3f5f7');
    expect(cssContent).toContain('--cq-accent: #56b4e9');
    expect(cssContent).toContain('--cq-success: #55b889');
    expect(cssContent).toContain('--cq-danger: #e47777');
  });

  it('should have all manifest runtime assets present on disk in public/assets', () => {
    const csvPath = path.resolve(__dirname, '../public/assets/manifests/asset-manifest.csv');
    expect(fs.existsSync(csvPath)).toBe(true);
    
    const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n').slice(1);
    expect(lines.length).toBeGreaterThanOrEqual(5);

    for (const line of lines) {
      const parts = line.split(',');
      const assetRelPath = parts[1]?.trim();
      if (assetRelPath) {
        const fullPath = path.resolve(__dirname, '../public/assets', assetRelPath);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    }
  });
});
