const Footer = () => {
    return (
        <footer>
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
                <p className="text-sm">
                    © 2026 Form_Generator. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-3 md:mt-0 text-sm">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">
                        Terms
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">
                        Contact
                    </a>
                </div>
            </div>
        </footer>

    )
}

export default Footer