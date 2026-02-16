export const considerations: string[] = [
  "Audit review rate: what percentage of users review the audit trail after agent actions",
  "Selective undo rate: how often users undo individual actions indicates the trail is usable and valuable",
  "Time-to-discovery: how quickly users identify and correct problematic agent actions",
  "Balancing log detail with performance  -  storing every action at full fidelity has storage and rendering costs",
  "Grouping actions by task requires the agent to maintain goal context throughout execution",
  "Selective undo may have cascading effects  -  undoing step 3 of 5 may invalidate steps 4 and 5",
  "Privacy implications of detailed action logging, especially for shared or enterprise environments"
];
