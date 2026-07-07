import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
    width: 100%;
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
    
    padding-bottom: 120px;

    background: ${theme.colors.white};
`;

export const Logo = styled.img`
    width: min(36vw, 150px);
    height: auto;
    display: block;
`;