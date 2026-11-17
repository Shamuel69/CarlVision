
function About() {
    return (
        <div className="w-full min-h-screen bg-(--bg-primary) text-(--text-primary) ">
            <div className="flex flex-col gap-5 w-[95%] mx-auto pt-5">
                <h1 className="text-4xl font-bold mb-4  relative w-fit ">About CarlVision<span className="absolute bottom-0 left-0 w-full h-0.5  origin-center bg-(--accent) "/></h1>
                <h4 className="font-semibold text-lg pl-5">What is CarlVision?</h4>
                <p className="text-md text-center max-w-4xl pl-7">
                    CarlVision is a web application that lets students, developers, and curious minds, a chance to experiment and gain a clear and sharp understanding about image processing and its various use cases. Learn how to apply these filters or gain a better understanding of how computers really see the world. 
                </p>
                <h4 className="font-semibold text-lg pl-5">Who is this for?</h4>

                <p className="text-sm text-center max-w-4xl  pl-7">
                    Origionally targeted for Computer Science students, I found that CarlVision could be used in many applications in the world of STEM. Ranging from robotics to photography, CarlVision is there to help demonstrate and aid in common filters students may be confused by.
                </p>
                <h4 className="font-semibold text-lg pl-5">Why did I make this?</h4>

                <p className="text-sm text-center max-w-4xl  pl-7">
                    A long time ago, as a high school student who had recently picked up programming, I attempted to learn computer vision through OpenCV. I quickly found that the documentation was difficult to follow and often far too advanced for someone just starting out.
                    Despite my initial frustration, I persisted and eventually learned the library. CarlVision grew out of that experience. I wanted to create a hands-on learning aid for aspiring programmers, students, and anyone curious about image processing.
                    This project is my way of giving back to the people and resources that helped me get where I am today.</p>
                <h4 className="font-semibold text-lg pl-5">Authors Note</h4>

                <p className="text-sm text-center max-w-4xl  pl-7">
                    Thank you for using CarlVision! I hope you enjoy using my application and hopefully you discovered something you can write home about!  
                </p>
                <h4 className="font-semibold text-lg pl-5">Contact Me</h4>
                <p className="text-sm text-center max-w-4xl  pl-7">
                    I am committed to continuous improvement and welcome feedback from students and curious users. If you have any suggestions, questions, or comments, please feel free to reach out to me using the contact info below! Your input is important to me and will be looked into with heavy consideration.
                </p>

                <div className="flex flex-col gap-2.5">
                    <h4 className="text-2xl font-semibold">Contact</h4>
                    <div className="flex flex-col gap-2.5 ml-2.5">
                        <label>LinkedIn:</label>
                        <a href="linkedin.com/in/sam-parnell-b616b8222" target="_blank" rel="noopener noreferrer" className="ml-2.5 hover:text-(--accent) cursor-pointer" >linkedin.com/in/sam-parnell-b616b8222</a>
                        <label>Business Email:</label>
                        <a href="mailto:parnellsamuel8@gmail.com?subject=CarlVisionInquiry" className="ml-2.5 hover:text-(--accent) cursor-pointer">parnellsamuel8@gmail.com</a>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;