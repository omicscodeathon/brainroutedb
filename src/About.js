import React from "react";
import { Info, Users, Globe, Github, GraduationCap } from "lucide-react";

const teamMembers = [
  {
    name: "Soham Shirolkar",
    institution: "University of South Florida, USA",
    image: "https://github.com/soham2400.png",
    github: "https://github.com/soham2400",
  },
  {
    name: "Lewis Tem",
    institution: "University of Buea, Cameroon",
    image: "https://github.com/Mr-Nnobody.png",
    github: "https://github.com/Mr-Nnobody",
  },
  {
    name: "Leah W. Cerere",
    institution: "Mount Kenya University, Kenya",
    image: "https://github.com/leacere.png",
    github: "https://github.com/leacere",
  },
  {
    name: "Noura E. Ahmed",
    institution: "Munster Technological University, Ireland",
    image: "https://github.com/nouraahmed.png",
    github: "https://github.com/nouraahmed",
  },
  {
    name: "Georges Somé",
    institution:
      "Institut de Recherche en Sciences de la Santé, Ouagadougou, Burkina Faso",
    image: "https://ui-avatars.com/api/?name=Georges+Some&background=random",
    github: "#",
  },
  {
    name: "Olaitan I. Awe",
    institution: "Institute for Genomic Medicine Research, USA",
    image: "https://github.com/laitanawe.png",
    github: "https://github.com/laitanawe",
  },
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          About BrainRouteDB
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          A comprehensive database for Blood-Brain Barrier (BBB) permeability
          predictions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-600" />
              Project Overview
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                BrainRouteDB is a specialized resource designed to assist
                researchers in drug discovery and development. It stands as the
                first database of its kind to store a growing, self-updating
                repository of BBB permeability predictions, offering consistency
                and reproducibility for future research.
              </p>
              <p>
                Utilizing advanced machine learning models, we analyze molecular
                structures to predict their likelihood of crossing the BBB. This
                data helps scientists prioritize candidates early in the drug
                development pipeline.
              </p>
              <p>
                This project was developed as part of the Omics Codeathon,
                bringing together experts in bioinformatics, machine learning,
                and software development to provide a responsive, searchable
                interface for the scientific community.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              Resources
            </h2>
            <p className="text-slate-600 mb-6">
              Access our open-source code and the full BrainRoute platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/omicscodeathon/brainroutedb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Github className="w-5 h-5" />
                GitHub Repository
              </a>
              <a
                href="https://brainroute.streamlit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Globe className="w-5 h-5" />
                BrainRoute Platform
              </a>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-3">
              Open Science
            </h3>
            <p className="text-blue-800">
              We believe in the power of open collaboration. All our data and
              models are available to the scientific community to foster
              innovation in neurological research.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Meet the Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <div className="flex items-start justify-center gap-2 text-slate-500 text-sm mb-6 h-10">
                  <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{member.institution}</span>
                </div>

                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm font-medium bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full"
                >
                  <Github className="w-4 h-4" />
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
