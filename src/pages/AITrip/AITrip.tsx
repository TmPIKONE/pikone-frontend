import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecommendationWorkspaces } from '~/features/recommendations/recommendation.queries';
import {
  readRecommendationResult,
  readRecommendationTrip,
  readSelectedRecommendation,
  type RecommendationTripState,
  writeRecommendationResult,
} from '~/features/recommendations/recommendationStorage';
import * as S from './AITrip.styles';

const AITrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeTrip = location.state as RecommendationTripState | null;
  const selectedContext = useMemo(() => readSelectedRecommendation(), []);
  const workspaces = useRecommendationWorkspaces();

  useEffect(() => {
    const storedResult = readRecommendationResult();
    const trip = routeTrip ?? readRecommendationTrip();

    if (storedResult.recommendations?.length && storedResult.request) {
      navigate('/ai/result', { replace: true, state: storedResult });
      return;
    }

    if (trip?.recommendation && trip.request) {
      const recovered = {
        recommendations: [trip.recommendation],
        request: trip.request,
        updatedAt: trip.selectedAt,
        selectedCandidateSnapshotId: trip.recommendation.candidateSnapshotId ?? undefined,
        selectedKakaoPlaceId: trip.recommendation.kakaoPlaceId,
      };
      writeRecommendationResult(recovered);
      navigate('/ai/result', { replace: true, state: recovered });
      return;
    }

    const selectedWorkspace = workspaces.data?.find(
      (workspace) =>
        workspace.status === 'SELECTED' &&
        (!selectedContext?.kakaoPlaceId ||
          workspace.selectedKakaoPlaceId === selectedContext.kakaoPlaceId),
    );
    if (selectedWorkspace) {
      const recovered = {
        recommendations: selectedWorkspace.recommendations,
        request: selectedWorkspace.request,
        updatedAt: selectedWorkspace.updatedAt,
        workspaceId: selectedWorkspace.workspaceId,
        rootRequestId: selectedWorkspace.rootRequestId,
        selectedCandidateSnapshotId: selectedWorkspace.selectedCandidateSnapshotId,
        selectedKakaoPlaceId: selectedWorkspace.selectedKakaoPlaceId,
      };
      writeRecommendationResult(recovered);
      navigate('/ai/result', { replace: true, state: recovered });
      return;
    }

    if (!workspaces.isLoading) navigate('/ai?mode=new', { replace: true });
  }, [navigate, routeTrip, selectedContext, workspaces.data, workspaces.isLoading]);

  return (
    <S.Recovery role="status" aria-live="polite">
      선택한 추천을 불러오고 있어요.
    </S.Recovery>
  );
};

export default AITrip;
