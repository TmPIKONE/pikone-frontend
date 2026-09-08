import { Component } from 'react';
import type { ErrorInfo } from 'react';
import { reportFrontendError } from '~/utils/telemetry';
import type { AppErrorBoundaryProps, AppErrorBoundaryState } from './AppErrorBoundary.types';
import * as S from './AppErrorBoundary.styles';

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportFrontendError(error, {
      componentStack: info.componentStack ?? undefined,
      source: 'react_error_boundary',
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleHome = () => {
    window.location.assign('/home');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <S.Container>
        <S.Badge aria-hidden="true">!</S.Badge>
        <S.Title>화면을 불러오지 못했어요</S.Title>
        <S.Description>
          잠시 후 다시 시도해주세요. 같은 문제가 계속되면 홈으로 이동해 다른 메뉴를 이용할 수
          있어요.
        </S.Description>
        <S.ButtonRow>
          <S.RetryButton type="button" onClick={this.handleRetry}>
            다시 시도
          </S.RetryButton>
          <S.HomeButton type="button" onClick={this.handleHome}>
            홈으로
          </S.HomeButton>
        </S.ButtonRow>
      </S.Container>
    );
  }
}
