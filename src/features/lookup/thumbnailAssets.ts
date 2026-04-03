export type LookupAssetType =
  | 'STONE_WALL_FIELD_HOUSE'
  | 'STONE_WALL_HOUSE'
  | 'DEMOLITION_HOUSE'
  | 'NO_STONE_WALL_HOUSE'
  | 'D_SHAPED_HOUSE'
  | 'URBAN_HOUSE_VILLA';

export const DEFAULT_ASSET_IMAGE = '/images/home-type1-damBat.png';

export const LOOKUP_ASSET_IMAGE: Record<LookupAssetType, string> = {
  STONE_WALL_FIELD_HOUSE: '/images/home-type1-damBat.png',
  STONE_WALL_HOUSE: '/images/home-type2-dam.png',
  DEMOLITION_HOUSE: '/images/home-type4-tree.png',
  D_SHAPED_HOUSE: '/images/home-type3-parking.png',
  NO_STONE_WALL_HOUSE: '/images/home-type5-nodam.png',
  URBAN_HOUSE_VILLA: '/images/home-type6-nomalcity.png',
};

export const LOOKUP_ASSET_LABEL: Record<LookupAssetType, string> = {
  STONE_WALL_FIELD_HOUSE: '돌담+밭 주택',
  STONE_WALL_HOUSE: '돌담 주택',
  DEMOLITION_HOUSE: '창고포함주택',
  D_SHAPED_HOUSE: '철거주택',
  NO_STONE_WALL_HOUSE: '돌담없는 주택',
  URBAN_HOUSE_VILLA: '도심주택/빌라',
};

export const LOOKUP_THUMBNAIL_PRELOADS = Object.values(LOOKUP_ASSET_IMAGE);
