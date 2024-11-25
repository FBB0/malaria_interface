import { useNavigate } from 'react-router-dom';

export default function ModelSteps() {
  const steps = [
    { title: 'Input', subtitle: 'Blood sample' },
    { title: 'Process', subtitle: 'Creating the AI model', path: '/model-info' },
    { title: 'Output', subtitle: 'Results' },
  ];

  const navigate = useNavigate();

  return (
    <div className="mt-20">
      <h2 className="text-xl font-semibold mb-4">Learn how it works</h2>
      <p className="text-gray-600 mb-4">
        Click the buttons below to explore specific parts of the model.
      </p>
      <div className="flex gap-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => step.path && navigate(step.path)}
            className="bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-all text-left flex-1 sm:text-base text-sm"
          >
            <div className="text-gray-500">{step.title}</div>
            <div className="font-semibold">{step.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
