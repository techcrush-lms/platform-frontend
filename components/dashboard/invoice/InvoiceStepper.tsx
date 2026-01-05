import { INVOICE_STEPS, InvoiceStep } from '@/constants';
import clsx from 'clsx';

type Props = {
  currentStep: InvoiceStep;
  onStepClick: (step: InvoiceStep) => void;
};

const InvoiceStepper = ({ currentStep, onStepClick }: Props) => {
  const currentIndex = INVOICE_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <aside className='w-full md:w-72'>
      <ol
        className={clsx(
          // Base (mobile): horizontal
          'flex gap-3 overflow-x-auto pb-2',

          // Desktop: vertical
          'md:relative md:flex-col md:border-l md:dark:border-gray-600 md:border-gray-200 md:pl-6 md:space-y-5 md:overflow-visible'
        )}
      >
        {INVOICE_STEPS.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isLastStep = index === INVOICE_STEPS.length - 1;

          return (
            <li
              key={step.key}
              onClick={isLastStep ? undefined : () => onStepClick(step.key)}
              className={clsx(
                'group relative flex items-center gap-2 md:gap-4 rounded-md px-3 py-2 transition-colors shrink-0',
                {
                  // Active background adapts per theme
                  'bg-accent/70 dark:bg-accent/40': isActive,
                  'hover:bg-muted/70 dark:hover:bg-muted/40 text-gray-800 dark:text-white ':
                    !isActive && !isLastStep,
                  'cursor-pointer': !isLastStep,
                  'cursor-default': isLastStep,
                }
              )}
            >
              {/* Indicator */}
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all',
                  {
                    // Active
                    'bg-primary text-primary-foreground ring-2 ring-primary/30':
                      isActive,

                    // Completed
                    'bg-primary/15 text-primary border border-primary/30':
                      isCompleted && !isActive,

                    // Upcoming
                    'bg-background border border-border text-muted-foreground group-hover:border-primary/40':
                      !isActive && !isCompleted,
                  }
                )}
              >
                {index + 1}
              </span>

              {/* Label */}
              <span
                className={clsx(
                  'whitespace-nowrap text-sm md:text-base transition-colors',
                  {
                    'font-medium text-foreground dark:text-gray-400': isActive,
                    'text-foreground/80': isCompleted,
                    'text-muted-foreground group-hover:text-foreground':
                      !isActive && !isCompleted,
                  }
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default InvoiceStepper;
