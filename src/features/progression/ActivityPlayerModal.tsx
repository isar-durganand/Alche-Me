import React from 'react';
import { LevelSchema } from '../../domain/types/curriculum';
import { LevelRunnerModal } from './LevelRunnerModal';

export interface ActivityPlayerModalProps {
  level: LevelSchema;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({
  level,
  isOpen,
  onClose,
  onComplete,
}) => {
  return (
    <LevelRunnerModal
      level={level}
      isOpen={isOpen}
      onClose={onClose}
      onLevelCompleted={() => {
        if (onComplete) onComplete();
      }}
    />
  );
};
