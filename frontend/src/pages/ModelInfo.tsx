import { Award, Brain, Clock, Server } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card'; // Updated to use your new Card component

const InfoCard = ({ icon: Icon, title, children }) => (
  <Card className="mb-6">
    <div className="flex items-center gap-4 mb-4">
      <Icon className="h-8 w-8 text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </Card>
);

export default function ModelInfo() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{
      backgroundImage: "url('/Epoch_Background_Light.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-8 mb-auto">
        <div className="max-w-4xl mx-auto">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              About Our Solution
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Team EPOCH has successfully developed a winning solution for the Lacuna Fund's Malaria Detection Challenge, 
              which focused on creating an efficient diagnostic tool for malaria detection in Africa. Using Ultralytics YOLO, 
              our model accurately identifies and classifies malaria parasites in blood slide images, specifically detecting 
              the trophozoite stage and differentiating between infected Red Blood Cells (RBC) and uninfected White Blood Cells (WBC).
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard icon={Brain} title="Technical Approach">
              The winning solution made use of the You Only Look Once (YOLO) by Ultralytics and a Detection Transformers 
              with Assignment (DETA). A writeup will be made available in the future. Currently this website is making 
              use of a smaller YOLO model for speed and ease of inference.
            </InfoCard>

            <InfoCard icon={Clock} title="Current Limitations">
              These regions are limited in their ability to efficiently process the necessary amount of blood samples. 
              A human is only allowed to handle about 30 patients a day due to the negative effects the bright microscope 
              has on the human eye.
            </InfoCard>

            <InfoCard icon={Server} title="Infrastructure">
              The speed of detection is very much dependent on the available compute option. Currently this website is 
              using an A10G GPU hosted by Modal for inferencing. The website itself is hosted by Render. We are currently 
              hosting this for free on both platforms, so please do not spam us :)
            </InfoCard>

            <InfoCard icon={Award} title="Impact">
              This solution, which achieved top performance in the competition, helps address critical healthcare needs 
              in resource-limited settings by enabling rapid, automated diagnosis that can support healthcare workers and 
              improve patient care efficiency.
            </InfoCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
