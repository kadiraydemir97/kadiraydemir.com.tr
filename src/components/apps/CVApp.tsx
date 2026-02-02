export const CVApp = () => {
    return (
        <div className="w-full h-full bg-slate-900 overflow-hidden">
            <iframe
                src="/cv.pdf"
                className="w-full h-full border-none"
                title="Kadir Aydemir CV"
            />
        </div>
    );
};
