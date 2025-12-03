interface MatchScoreBadgeProps {
  score: number;
}

export default function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  // Color code based on match score
  const getColor = () => {
    if (score >= 20) return "bg-green-500";
    if (score >= 10) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <span
      className={`inline-block px-2 py-1 ${getColor()} text-white text-xs font-medium rounded-full`}
    >
      {score} pts
    </span>
  );
}
