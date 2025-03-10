import { Footer } from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";

function FooterBar() {
    return (
        <Footer container>
            <div className="w-full mt-10">
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Rangga Agastya™" year={2025} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="https://instagram.com/agastyra" target="_blank" icon={BsInstagram} />
                        <Footer.Icon href="https://github.com/agastyra" target="_blank" icon={BsGithub} />
                        <Footer.Icon href="https://linkedin.com/in/agastyra" target="_blank" icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export default FooterBar