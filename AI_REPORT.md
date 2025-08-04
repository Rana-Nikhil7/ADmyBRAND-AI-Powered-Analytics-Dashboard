This report details the AI-assisted workflow used to build the ADmyBRAND Insights dashboard, as required for the project submission. The use of AI was central to the rapid development process and accounted for 25% of the evaluation criteria.

## AI Tools Used

* **Primary tools**: `v0.dev`, `ChatGPT/Claude`, and `Cursor IDE` (with integrated GitHub Copilot features).

* **Key use cases**:
    * **`v0.dev`**: Used for generating the initial dashboard layout and for iterative UI refinement. Follow-up prompts were used to adjust spacing, change icons, and restructure the chart layout.
    * **`ChatGPT/Claude`**: Used for generating the complete mock data file, providing step-by-step guidance for complex features like the PDF export, and drafting all documentation, including the README and this report.
    * **`Cursor IDE`**: Used for real-time code completion, generating entire functions from commented instructions, explaining unfamiliar library code, and generating descriptive commit messages for version control.

## Sample Prompts (2-3 examples)

1.  **Initial `v0.dev` prompt for dashboard layout**:
    > "Create a modern, full-screen analytics dashboard page... using Next.js... and shadcn/ui components... The layout must include: a main header, a 2x2 grid of key metric cards... a full-width line chart... a bar and donut chart, and finally, a detailed data table with sorting, filtering, and pagination..."

2.  **Refinement prompt for animations and loading states**:
    > "Refine the existing dashboard. Integrate `framer-motion` to add a staggered fade-in animation and have metric cards scale on hover. Convert the page to a client component and use a `useEffect` hook with a `setTimeout` to simulate an API fetch, showing `shadcn/ui` `Skeleton` components during the loading state."

3.  **Prompt for generating mock data**:
    > "Create a TypeScript file named `mock-data.ts` exporting an object... containing arrays for `keyMetrics`, `performanceOverTime`... `trafficSources`, and an array of 50 `campaignPerformance` objects with columns like `campaignName`, `status`, `spend`, and `roi`."

## AI vs Manual Work Split

* **AI-generated: ~60%**
    The AI generated the initial project structure, the entire dashboard UI layout, the complete mock dataset, and the first drafts of all documentation. This provided a massive head start and handled most of the boilerplate code.

* **Manual coding & Customization: ~40%**
    Manual effort was focused on high-value tasks that required nuanced logic and an understanding of the project's state. Key customizations included:
    * **Fixing Chart Theming**: Manually refactoring all three chart components (`Line`, `Bar`, `Pie`) to replace the AI's static color codes with dynamic `hsl(var(...))` CSS variables. This was essential for making the charts readable in dark mode and was a task the AI could not complete on its own.
    * **Implementing Bonus Features**: Manually installing and wiring up the `jspdf` and `jspdf-autotable` libraries for the PDF export feature.
    * **Refining Real-time Logic**: Manually implementing the `setInterval` logic for the real-time "Users" update, including state management and a cleanup function to prevent memory leaks.
