import {IconDefinition} from '@ant-design/icons-angular';

export interface Likeable {
  isLiked: boolean;

  toggleLike(): void;

  iconCarrot: IconDefinition;
}
