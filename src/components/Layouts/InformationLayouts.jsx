const InformationLayouts = (props) => {
  const { children, info } = props;

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <h1 className="mb-6 text-3xl font-bold">{info}</h1>
      <div className="flex gap-4 justify-center">{children}</div>
    </div>
  );
};

export default InformationLayouts;
