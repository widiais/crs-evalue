import { Position, RELATIONSHIP_STATUS } from '@/constants';

export type RelationshipStatus = typeof RELATIONSHIP_STATUS[number];

// Legacy type for backward compatibility
export type WorkLocation = string;

export interface Location {
  id: string;
  name: string;
  city: string;
  category: 'Head Office' | 'Store';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Division {
  id: string;
  name: string;
  description?: string;
  head?: string; // Division Head name
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  templateIds: string[];
  pin: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  createdBy: string;
}

export interface CriteriaTemplate {
  id: string;
  level: Position;
  section1: AssessmentCriteria[];
  section2: AssessmentCriteria[];
  section3: {
    type: 'fixed_options';
    options: string[];
  };
}

export interface AssessmentCriteria {
  text: string;
  category: string;
}

export interface Employee {
  id: string;
  name: string;
  position: Position;
  location: string; // Using string for location names
  division?: string; // Using string for division names
}

export interface Evaluator {
  name: string;
  position: Position;
  division: string; // Using string for division names
  status: RelationshipStatus;
}

export interface AssessmentResult {
  id?: string;
  assessmentId: string;
  targetUser: {
    id: string;
    name: string;
  };
  evaluator: Evaluator;
  scores: {
    category: string;
    average: number;
  }[];
  semangatScores: number[];
  recommendation: string;
  submittedAt: Date;
}

export interface ActivityLog {
  id: string;
  assessmentId: string;
  evaluatorId: string;
  targetId: string;
  timestamp: Date;
  action: string;
  status: string;
} 