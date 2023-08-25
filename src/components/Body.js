export default function Body({ children, ...params }) {
  return (
    <div {...params} style={{ height: "100vh" }}>
      {children}
    </div>
  );
}
