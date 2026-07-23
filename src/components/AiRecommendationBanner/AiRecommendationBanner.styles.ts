import styled from '@emotion/styled';

export const Banner = styled.button`
    width: calc(100% + 36px);
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0px -18px 0;
    padding: 28px 42px;

    border: none;
    background: #315f9e;
    color: #ffffff;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:active {
        transform: scale(0.99);
    }
    
`;

export const Copy = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Eyebrow = styled.span`
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
`;

export const Title = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: clamp(24px, 6vw, 30px);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.05em;
`;

export const Description = styled.p`
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
`;

export const Action = styled.span`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 20px;
  padding: 0 18px;
  border-radius: 999px;
  background: #ffffff;
  color: #315f9e;
  font-size: 12px;
  font-weight: 800;
`;