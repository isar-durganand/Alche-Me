import React from 'react';
import { LevelSchema } from '../../domain/types/curriculum';
import { LevelRunnerModal } from './LevelRunnerModal';

export interface MissionBriefingModalProps {
  level: LevelSchema;
  isOpen: boolean;
  onClose: () => void;
  onLaunch?: (level: LevelSchema) => void;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  level,
  isOpen,
  onClose,
  onLaunch,
}) => {
  return (
    <LevelRunnerModal
      level={level}
      isOpen={isOpen}
      onClose={onClose}
      onLevelCompleted={() => {
        if (onLaunch) onLaunch(level);
      }}
    />
  );
};
