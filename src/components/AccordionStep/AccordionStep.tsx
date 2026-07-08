import { ReactNode } from 'react';
import { Check, Pencil } from 'lucide-react';
import * as S from './AccordionStep.styles';

interface AccordionStepProps {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isEditing: boolean;
  summaryLabel: string;
  summaryValue: string;
  onEditClick: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const AccordionStep = ({
  stepNumber,
  title,
  isCompleted,
  isEditing,
  summaryLabel,
  summaryValue,
  onEditClick,
  children,
  footer,
}: AccordionStepProps) => {
  const showSummary = isCompleted && !isEditing;

  if (showSummary) {
    return (
      <S.SummaryRow>
        <S.SummaryLeft>
          <S.CheckBadge>
            <Check size={12} strokeWidth={3} />
          </S.CheckBadge>
          <S.SummaryText>
            <S.SummaryLabel>{summaryLabel}</S.SummaryLabel>
            <S.SummaryValue>{summaryValue}</S.SummaryValue>
          </S.SummaryText>
        </S.SummaryLeft>
        <S.EditButton type="button" onClick={onEditClick} aria-label={`${summaryLabel} 수정`}>
          <Pencil size={16} />
        </S.EditButton>
      </S.SummaryRow>
    );
  }

  return (
    <S.Card>
      <S.CardHeader>
        <S.StepBadge>{stepNumber}</S.StepBadge>
        <S.StepTitle>{title}</S.StepTitle>
      </S.CardHeader>
      <S.CardBody>{children}</S.CardBody>
      {footer && <S.CardFooter>{footer}</S.CardFooter>}
    </S.Card>
  );
};

export default AccordionStep;
