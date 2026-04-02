import { Container } from "@/components/common/Container";
import { IssueForm } from "@/components/issue/IssueForm";
export default function Issue() {
  return (
    <div className="selection:bg-primary/20 relative w-full">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
        }}
      />
      <Container>
        <IssueForm />
      </Container>
    </div>
  );
}
