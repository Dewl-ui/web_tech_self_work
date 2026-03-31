export default function Header() {
    return (
        <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="shrink-0 flex items-center">
                        <Link to="/">
                            <h1>Team 4 - Project Management Tool</h1>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}