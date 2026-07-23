import styled from '@emotion/styled';

export const Banner = styled.button`
  width: 100%;
  min-height: 74px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 13px 15px;
  border: 1px solid #d8e7fc;
  border-radius: 22px;
  background: rgba(239, 246, 255, 0.94);
  color: #365b91;
  text-align: left;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
  cursor: pointer;
  transition: transform 0.18s ease;

  &:active {
    transform: scale(0.985);
  }

  > svg {
    flex: 0 0 auto;
    margin-left: auto;
  }
`;

export const Icon = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #4f82cf;
  color: #ffffff;
  box-shadow: 0 9px 18px rgba(59, 105, 177, 0.2);

  span {
    font-size: 18px;
    font-weight: 900;
  }
`;

export const Copy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: #244875;
    font-size: 13px;
    font-weight: 820;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #7189aa;
    font-size: 10px;
    font-weight: 650;
  }
`;
