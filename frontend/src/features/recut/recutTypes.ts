export interface CutPlaneState {
  angle: number;
  offset: number;
}

export interface PartVisibility {
  part1: boolean;
  part2: boolean;
}

export interface RecutState {
  cutPlane: CutPlaneState;
  visibility: PartVisibility;
  showReferenceModel: boolean;
  showSectionHelper: boolean;
}

export const DEFAULT_RECUT_STATE: RecutState = {
  cutPlane: {
    angle: 0,
    offset: 0
  },
  visibility: {
    part1: true,
    part2: true
  },
  showReferenceModel: false,
  showSectionHelper: true
};
