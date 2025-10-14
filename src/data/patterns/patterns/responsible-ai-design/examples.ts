import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "IBM Watson OpenScale - Fairness Monitoring",
    description: "Enterprise-grade automated fairness monitoring that evaluates models using AutoAI. The dashboard displays real-time bias detection across protected attributes like age and gender, showing disparate impact ratios (19.24% vs 80% threshold) and fairness scores. Enables organizations to identify and mitigate bias in production AI systems with actionable metrics comparing monitored groups against reference populations.",
    image: "/images/examples/ibm-watson-fairness-dashboard.gif",
    altText: "IBM Watson OpenScale fairness dashboard showing overall fairness evaluation marked as 'Not fair', with bar charts comparing monitored vs reference groups, and a detailed table displaying protected attributes (Age with 25.96% disparity and Gender with 72.54% disparity) along with favorable outcome percentages"
  },
  {
    title: "Microsoft Azure ML - Responsible AI Platform",
    description: "Azure Machine Learning Studio provides enterprise infrastructure for responsible AI deployment with dedicated compute clusters and monitoring capabilities. The platform integrates fairness assessment, model debugging, and bias detection tools directly into the ML workflow, enabling data scientists to build and deploy AI models with built-in responsibility safeguards at scale.",
    image: "/images/examples/azure-responsible-ai-compute.gif",
    altText: "Microsoft Azure Machine Learning Studio compute cluster management interface showing a ResponsibleAI compute cluster with 4 nodes succeeded, demonstrating enterprise platform support for responsible AI model deployment and monitoring"
  },
  {
    title: "Hugging Face Model Cards",
    description: "Industry-standard transparency framework for documenting AI models with structured bias disclosures, ethical considerations, and intended use cases. Model cards provide detailed sections on limitations, biases in training data, fairness metrics, and potential harms, enabling developers and users to make informed decisions about model deployment and understand risks before implementation.",
    image: "/images/examples/huggingface-models.gif",
    altText: "Hugging Face model card documentation showing comprehensive bias and ethics sections with structured transparency information"
  }
];
