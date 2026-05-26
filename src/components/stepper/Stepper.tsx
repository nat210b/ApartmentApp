import "./Stepper.css";

export type StepperStep = {
    id: number;
    title: string;
};

type StepperProps = {
    steps: StepperStep[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
};

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
    return (
        <div className="stepper">
            {steps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                    <div
                        key={step.id}
                        className={[
                            "stepper-item",
                            isCompleted ? "is-completed" : "",
                            isActive ? "is-active" : "",
                        ].filter(Boolean).join(" ")}
                    >
                        <button
                            type="button"
                            className="stepper-button"
                            onClick={() => onStepClick?.(step.id)}
                            disabled={!onStepClick}
                        >
                            <span className="stepper-node">{step.id}</span>
                            <span className="stepper-title">{step.title}</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default Stepper;
