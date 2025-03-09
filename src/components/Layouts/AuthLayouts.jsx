const AuthLayouts = (props) => {
    const { children, title } = props;

    return (
        <div className="w-full max-w-xs">
            <h1 className="text-blue-600 text-2xl font-bold mb-2">{title}</h1>
            <p className="font-medium text-slate-600 mb-4">
                Hello, please enter your detail!
            </p>
            {children}
        </div>
    );
};

export default AuthLayouts;
