import { useDeleteHomeLocation } from '~/hooks/useDeleteHomeLocation';
import type {
  HomeLocationResponse,
  HomeLocationType,
} from '~/apis/homeLocation/homeLocation.types';
import * as S from './HomeLocationList.styles';
import type { HomeLocationListProps } from './HomeLocationList.types';

const TYPE_LABEL: Record<HomeLocationType, string> = {
  HOME: '집',
  OFFICE: '회사',
  CUSTOM: '기타',
};

interface HomeLocationRowProps {
  location: HomeLocationResponse;
  onEdit: (location: HomeLocationResponse) => void;
}

const HomeLocationRow = ({ location, onEdit }: HomeLocationRowProps) => {
  const { mutate: deleteHomeLocation, isPending } = useDeleteHomeLocation(location.id);

  const handleDelete = () => {
    if (!window.confirm(`'${location.label}'을 삭제할까요?`)) return;
    deleteHomeLocation();
  };

  return (
    <S.Row>
      <S.Info>
        <S.LabelRow>
          <S.Label>{location.label}</S.Label>
          <S.TypeTag>{TYPE_LABEL[location.type]}</S.TypeTag>
        </S.LabelRow>
        {location.radiusMeters != null && (
          <S.RadiusText>반경 {location.radiusMeters}m</S.RadiusText>
        )}
      </S.Info>

      <S.ActionRow>
        <S.EditButton type="button" onClick={() => onEdit(location)}>
          수정
        </S.EditButton>
        <S.DeleteButton type="button" onClick={handleDelete} disabled={isPending}>
          삭제
        </S.DeleteButton>
      </S.ActionRow>
    </S.Row>
  );
};

const HomeLocationList = ({ homeLocations, onEdit }: HomeLocationListProps) => {
  if (homeLocations.length === 0) {
    return <S.EmptyText>등록된 고정 장소가 없어요.</S.EmptyText>;
  }

  return (
    <S.List>
      {homeLocations.map((location) => (
        <HomeLocationRow key={location.id} location={location} onEdit={onEdit} />
      ))}
    </S.List>
  );
};

export default HomeLocationList;
