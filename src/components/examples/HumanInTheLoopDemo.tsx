import React, { useState } from 'react';
import Image from 'next/image';

// Add icons and illustrations
const aiIcon = "https://img.icons8.com/fluency/96/artificial-intelligence.png";
const humanIcon = "https://img.icons8.com/fluency/96/person-male.png";
const loopIcon = "https://img.icons8.com/fluency/96/refresh.png";
const moderationIllustration = "https://img.icons8.com/color/480/content-moderation.png";

// Examples in the wild images
const exampleImages = {
  googleFace: "/images/examples/google-face-detection.gif",
  openai: "/images/examples/openai-human-feedback.png",
  grammarly: "/images/examples/grammarly-suggestions.gif"
};

const posts = [
  {
    user: "@alice",
    text: "I can't believe this happened! DM me for the details.",
    aiDecision: "Flagged for Review",
    reason: "Possible sharing of sensitive information.",
    confidence: 0.91
  },
  {
    user: "@bob",
    text: "This product is terrible and the company should be ashamed!",
    aiDecision: "Flagged for Review",
    reason: "Detected strong negative sentiment and potentially abusive language.",
    confidence: 0.82
  },
  {
    user: "@carol",
    text: "Check out my new blog post on healthy eating!",
    aiDecision: "No Action Needed",
    reason: "No policy violations detected.",
    confidence: 0.97
  },
  {
    user: "@dave",
    text: "Contact me at my personal email for the password.",
    aiDecision: "Flagged for Review",
    reason: "Possible sharing of private credentials.",
    confidence: 0.88
  }
];

const images = [
  {
    user: "@eve",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80",
    aiDecision: "No Action Needed",
    reason: "No inappropriate content detected.",
    confidence: 0.99
  },
  {
    user: "@frank",
    imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&q=80",
    aiDecision: "Flagged for Review",
    reason: "Possible depiction of violence.",
    confidence: 0.76
  },
  {
    user: "@grace",
    imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80",
    aiDecision: "Flagged for Review",
    reason: "Possible nudity detected.",
    confidence: 0.84
  },
  {
    user: "@heidi",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&q=80",
    aiDecision: "No Action Needed",
    reason: "No policy violations detected.",
    confidence: 0.97
  }
];

function TextModerationDemo() {
  const [current, setCurrent] = useState(0);
  const [userDecision, setUserDecision] = useState<string | null>(null);
  const post = posts[current];

  const handleDecision = (decision: string) => {
    setUserDecision(decision);
  };
  const handleNext = () => {
    setUserDecision(null);
    setCurrent((prev) => (prev + 1 < posts.length ? prev + 1 : 0));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image src={aiIcon} alt="AI" width={24} height={24} className="w-6 h-6" />
          <h3 className="text-xl font-semibold text-gray-800">Text Post Moderation</h3>
        </div>
        <p className="text-gray-700 text-sm mt-2">
          Review AI-flagged social media posts and make the final moderation decision.
        </p>
        <span className="block text-xs text-gray-400 mt-1">(Post {current + 1} of {posts.length})</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="mb-2 text-gray-700">
            <span className="font-semibold text-blue-700">{post.user}</span>: {post.text}
          </div>
          <div className="text-xs text-gray-500 mb-1">AI Decision: <span className="font-semibold text-pink-600">{post.aiDecision}</span></div>
          <div className="text-xs text-gray-500 mb-1">Reason: {post.reason}</div>
          <div className="text-xs text-gray-500 mb-2">AI Confidence: <span className="font-semibold text-violet-700">{Math.round(post.confidence * 100)}%</span></div>
        </div>
        {!userDecision ? (
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 rounded bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition"
              onClick={() => handleDecision('Approve')}
            >
              Approve
            </button>
            <button
              className="px-3 py-1 rounded bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 transition"
              onClick={() => handleDecision('Reject')}
            >
              Reject
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition"
              onClick={() => handleDecision('Override – Publish Anyway')}
            >
              Override
            </button>
          </div>
        ) : (
          <div className="mt-3 text-sm text-blue-700 flex items-center gap-4">
            <span><strong>Action taken:</strong> {userDecision}</span>
            <button
              className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 text-xs"
              onClick={handleNext}
            >
              Next Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageModerationDemo() {
  const [current, setCurrent] = useState(0);
  const [userDecision, setUserDecision] = useState<string | null>(null);
  const img = images[current];

  const handleDecision = (decision: string) => {
    setUserDecision(decision);
  };
  const handleNext = () => {
    setUserDecision(null);
    setCurrent((prev) => (prev + 1 < images.length ? prev + 1 : 0));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image src={aiIcon} alt="AI" width={24} height={24} className="w-6 h-6" />
          <h3 className="text-xl font-semibold text-gray-800">Image Moderation</h3>
        </div>
        <p className="text-gray-700 text-sm mt-2">
          Review AI-flagged user-uploaded images and make the final moderation decision.
        </p>
        <span className="block text-xs text-gray-400 mt-1">(Image {current + 1} of {images.length})</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Image src={img.imageUrl} alt="User upload" width={80} height={80} className="w-20 h-20 object-cover rounded border border-gray-200" />
            <span className="font-semibold text-blue-700">{img.user}</span>
          </div>
          <div className="text-xs text-gray-500 mb-1">AI Decision: <span className="font-semibold text-pink-600">{img.aiDecision}</span></div>
          <div className="text-xs text-gray-500 mb-1">Reason: {img.reason}</div>
          <div className="text-xs text-gray-500 mb-2">AI Confidence: <span className="font-semibold text-violet-700">{Math.round(img.confidence * 100)}%</span></div>
        </div>
        {!userDecision ? (
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 rounded bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition"
              onClick={() => handleDecision('Approve')}
            >
              Approve
            </button>
            <button
              className="px-3 py-1 rounded bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 transition"
              onClick={() => handleDecision('Reject')}
            >
              Reject
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition"
              onClick={() => handleDecision('Override – Publish Anyway')}
            >
              Override
            </button>
          </div>
        ) : (
          <div className="mt-3 text-sm text-blue-700 flex items-center gap-4">
            <span><strong>Action taken:</strong> {userDecision}</span>
            <button
              className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 text-xs"
              onClick={handleNext}
            >
              Next Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamplesInTheWild() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Examples in the Wild</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Grammarly Writing Assistant */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Image 
            src={exampleImages.grammarly} 
            alt="Grammarly writing suggestions" 
            width={400}
            height={192}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">Grammarly Writing Assistant</h3>
            <p className="text-sm text-gray-600 mt-2">
              Grammarly suggests grammar, spelling, and style improvements as users write, but requires 
              human approval before changes are applied, maintaining user control over the final text.
            </p>
          </div>
        </div>
        
        {/* Google Photos Face Detection */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Image 
            src={exampleImages.googleFace} 
            alt="Google Photos face detection" 
            width={400}
            height={192}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">Google Photos Face Detection</h3>
            <p className="text-sm text-gray-600 mt-2">
              Google Photos automatically detects faces in images but relies on users to confirm identities, 
              allowing humans to verify AI suggestions before they&apos;re applied.
            </p>
          </div>
        </div>
        
        {/* OpenAI Human Feedback */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Image 
            src={exampleImages.openai} 
            alt="OpenAI human feedback" 
            width={400}
            height={192}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">OpenAI RLHF</h3>
            <p className="text-sm text-gray-600 mt-2">
              OpenAI uses Reinforcement Learning from Human Feedback (RLHF) to improve their models, 
              having humans rate AI outputs to train reward models that guide further refinement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HumanInTheLoopDemo() {
  return (
    <div className="space-y-8">
      {/* Header with illustration */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image 
            src={moderationIllustration} 
            alt="Content moderation" 
            width={128}
            height={128}
            className="w-32 h-32 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Human-in-the-Loop AI Moderation</h2>
            <p className="text-gray-600">
              This pattern demonstrates how AI can flag potentially problematic content for human review,
              creating an effective collaboration between automated systems and human judgment.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex flex-col items-center">
                <Image src={aiIcon} alt="AI" width={40} height={40} className="w-10 h-10" />
                <span className="text-xs text-gray-500 mt-1">AI Flags</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <Image src={humanIcon} alt="Human" width={40} height={40} className="w-10 h-10" />
                <span className="text-xs text-gray-500 mt-1">Human Decides</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <Image src={loopIcon} alt="Feedback loop" width={40} height={40} className="w-10 h-10" />
                <span className="text-xs text-gray-500 mt-1">System Learns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TextModerationDemo />
        <ImageModerationDemo />
      </div>

      {/* Examples in the Wild section */}
      <ExamplesInTheWild />
    </div>
  );
}

export { TextModerationDemo, ImageModerationDemo }; 