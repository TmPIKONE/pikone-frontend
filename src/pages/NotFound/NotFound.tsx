import { useNavigate } from 'react-router-dom';
import type { NotFoundProps } from './NotFound.types';
import * as S from './NotFound.styles';

const NotFound = ({ title = '페이지를 찾을 수 없어요' }: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Code aria-hidden="true">404</S.Code>
      <S.Title>{title}</S.Title>
      <S.Description>주소가 바뀌었거나 삭제된 페이지일 수 있어요.</S.Description>
      <S.ButtonRow>
        <S.BackButton type="button" onClick={() => navigate(-1)}>
          이전 화면
        </S.BackButton>
        <S.HomeButton type="button" onClick={() => navigate('/')}>
          홈으로
        </S.HomeButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default NotFound;
