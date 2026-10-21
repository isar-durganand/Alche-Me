import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PERIODIC_ELEMENTS } from '../src/data/periodicTableData';
import { EXPERIMENTS_DATA } from '../src/data/experimentsData';

describe('Alche-Me Design System & Shell Test Suite', () => {
  it('should have a verified periodic table dataset with complete scientific fields', () => {
    expect(PERIODIC_ELEMENTS.length).toBeGreaterThanOrEqual(34);

    const first = PERIODIC_ELEMENTS[0];
    expect(first.number).toBe(1);
    expect(first.symbol).toBe('H');
    expect(first.name).toBe('Hydrogen');
    expect(first.mass).toBeGreaterThan(0);
    expect(first.period).toBe(1);
    expect(first.group).toBe(1);

    // Verify each element in dataset has required fields
    for (const el of PERIODIC_ELEMENTS) {
      expect(el.number).toBeGreaterThan(0);
      expect(el.symbol).toBeTruthy();
      expect(el.name).toBeTruthy();
      expect(el.category).toBeTruthy();
      expect(el.electron_configuration).toBeTruthy();
      expect(el.summary).toBeTruthy();
    }
  });

  it('should have all 10 MRIIRS Engineering Chemistry Practicals mapped in experimentsData', () => {
    expect(EXPERIMENTS_DATA.length).toBe(10);

    const titles = EXPERIMENTS_DATA.map((e) => e.title);
    expect(titles).toContain('Determination of Hardness of Water using EDTA');
    expect(titles).toContain('Determination of Alkalinity of Water Sample');
    expect(titles).toContain('Determination of Viscosity of Lubricating Oil by Redwood Viscometer');
    expect(titles).toContain('Conductometric Titration of Strong Acid vs. Strong Base');
    expect(titles).toContain('Determination of Ferrous Ion Concentration using Potentiometer');

    for (const exp of EXPERIMENTS_DATA) {
      expect(exp.id).toBeTruthy();
      expect(exp.num).toBeTruthy();
      expect(exp.manualPage).toBeTruthy();
      expect(exp.aim).toBeTruthy();
      expect(exp.principle).toBeTruthy();
      expect(exp.reagents.length).toBeGreaterThan(0);
      expect(exp.apparatus.length).toBeGreaterThan(0);
      expect(exp.procedure.length).toBeGreaterThan(0);
      expect(exp.formulae).toBeTruthy();
      expect(exp.compoundName).toBeTruthy();
    }
  });

  it('should enforce high-contrast and reduced-motion rules in index.css', () => {
    const cssPath = path.resolve(__dirname, '../src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('.high-contrast');
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(cssContent).toContain('*:focus-visible');
    expect(cssContent).toContain('--cq-surface-hover:');
    expect(cssContent).toContain('--cq-accent-subtle:');
    expect(cssContent).toContain('--cq-transition-fast:');
  });

  it('should export all reusable UI components from src/components/ui/index.ts', () => {
    const indexPath = path.resolve(__dirname, '../src/components/ui/index.ts');
    expect(fs.existsSync(indexPath)).toBe(true);
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain("export * from './Button'");
    expect(content).toContain("export * from './Card'");
    expect(content).toContain("export * from './Badge'");
    expect(content).toContain("export * from './Tabs'");
    expect(content).toContain("export * from './Modal'");
    expect(content).toContain("export * from './Input'");
    expect(content).toContain("export * from './ProgressBar'");
    expect(content).toContain("export * from './Alert'");
    expect(content).toContain("export * from './Skeleton'");
    expect(content).toContain("export * from './Tooltip'");
  });
});
