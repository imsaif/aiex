import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "GPTZero AI Detection - Confidence Levels",
    description: "Demonstrates how confidence scores help users understand AI certainty. Shows three confidence levels: highly confident (100% AI detected), moderately confident (86% human, use caution), and uncertain (mixed results 40-58%). Visual circular gauges and percentage breakdowns make confidence immediately clear.",
    image: "/images/examples/gptzero-high-confidence.png",
    altText: "GPTZero showing AI detection with high confidence indicator using circular gauge and 100% probability display"
  },
  {
    title: "AWS Rekognition - Confidence Scores in Computer Vision",
    description: "Shows confidence percentages for detected objects, faces, and labels in images. Each detection includes a confidence score helping users understand how certain the AI model is about its predictions, enabling informed decisions on whether to trust the detection results.",
    image: "/images/examples/aws-rekognition-confidence.png",
    altText: "AWS Rekognition console showing face detection with confidence percentage scores for detected facial attributes"
  }
];
