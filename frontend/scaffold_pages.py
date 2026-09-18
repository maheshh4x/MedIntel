import os

routes = {
    # Public
    "src/app/find-doctors": "Find Doctors",
    "src/app/about": "About Us",
    "src/app/contact": "Contact",

    # Patient
    "src/app/patient/appointments": "Patient Appointments",
    "src/app/patient/ai-symptom-checker": "AI Symptom Checker",
    "src/app/patient/reports": "Medical Reports",
    "src/app/patient/trends": "Health Trends",
    "src/app/patient/assistant": "AI Health Assistant",
    
    # Doctor
    "src/app/doctor/appointments": "Doctor Appointments",
    "src/app/doctor/patients": "Patient Directory",
    "src/app/doctor/patient/[id]": "Patient Details",
    "src/app/doctor/clinical-summary": "AI Clinical Summary",
    "src/app/doctor/similar-cases": "Similar Clinical Cases",

    # Admin
    "src/app/admin/patients": "Manage Patients",
    "src/app/admin/doctors": "Manage Doctors",
    "src/app/admin/appointments": "System Appointments",
    "src/app/admin/analytics": "System Analytics",
}

template_dashboard = """import React from 'react';
import {{ DashboardLayout }} from '{layout_path}';
import {{ LayoutDashboard, Users, Calendar, Activity, BarChart, FileText, TrendingUp, MessageSquare }} from 'lucide-react';
import styles from '{css_path}';

export default function {component_name}() {{
  const navItems = {nav_items};

  return (
    <DashboardLayout navItems={{navItems}} userRole="{role}" userName="{user_name}">
      <div className={{styles.header}}>
        <div>
          <h1 className={{styles.title}}>{title}</h1>
          <p className={{styles.subtitle}}>This section is active and ready for data integration.</p>
        </div>
      </div>
      <div className={{styles.card}}>
         <p>Mock data for {title} will appear here.</p>
      </div>
    </DashboardLayout>
  );
}}
"""

template_public = """import React from 'react';
import {{ Navbar }} from '../../components/layout/Navbar';
import {{ Footer }} from '../../components/layout/Footer';

export default function {component_name}() {{
  return (
    <>
      <Navbar />
      <main className="main-content container" style={{{{paddingTop: '4rem', paddingBottom: '4rem'}}}}>
        <h1>{title}</h1>
        <p style={{{{marginTop: '1rem'}}}}>Content for {title} goes here.</p>
      </main>
      <Footer />
    </>
  );
}}
"""

patient_nav = "[{ icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/patient/dashboard' }, { icon: <Calendar size={20} />, label: 'Appointments', href: '/patient/appointments' }, { icon: <Activity size={20} />, label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker' }, { icon: <FileText size={20} />, label: 'Medical Reports', href: '/patient/reports' }, { icon: <TrendingUp size={20} />, label: 'Health Trends', href: '/patient/trends' }, { icon: <MessageSquare size={20} />, label: 'AI Assistant', href: '/patient/assistant' }]"

doctor_nav = "[{ icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/doctor/dashboard' }, { icon: <Calendar size={20} />, label: 'Appointments', href: '/doctor/appointments' }, { icon: <Users size={20} />, label: 'Patients', href: '/doctor/patients' }, { icon: <FileText size={20} />, label: 'Clinical Summary', href: '/doctor/clinical-summary' }, { icon: <Activity size={20} />, label: 'Similar Cases', href: '/doctor/similar-cases' }]"

admin_nav = "[{ icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin/dashboard' }, { icon: <Users size={20} />, label: 'Manage Patients', href: '/admin/patients' }, { icon: <Users size={20} />, label: 'Manage Doctors', href: '/admin/doctors' }, { icon: <Calendar size={20} />, label: 'Appointments', href: '/admin/appointments' }, { icon: <BarChart size={20} />, label: 'Analytics', href: '/admin/analytics' }]"

for route, title in routes.items():
    os.makedirs(route, exist_ok=True)
    file_path = os.path.join(route, 'page.tsx')
    
    component_name = title.replace(' ', '').replace('[', '').replace(']', '')
    
    if route.startswith('src/app/patient'):
        depth = len(route.split('/')) - 2
        layout_path = '../' * depth + 'components/layout/DashboardLayout'
        css_path = '../' * (depth - 1) + 'dashboard/dashboard.module.css'
        content = template_dashboard.format(
            layout_path=layout_path, css_path=css_path, component_name=component_name, 
            nav_items=patient_nav, role="Patient", user_name="Mahesh", title=title)
            
    elif route.startswith('src/app/doctor'):
        depth = len(route.split('/')) - 2
        layout_path = '../' * depth + 'components/layout/DashboardLayout'
        css_path = '../' * (depth - 1) + '../patient/dashboard/dashboard.module.css'
        content = template_dashboard.format(
            layout_path=layout_path, css_path=css_path, component_name=component_name, 
            nav_items=doctor_nav, role="Doctor", user_name="Dr. Sarah Chen", title=title)
            
    elif route.startswith('src/app/admin'):
        depth = len(route.split('/')) - 2
        layout_path = '../' * depth + 'components/layout/DashboardLayout'
        css_path = '../' * (depth - 1) + '../patient/dashboard/dashboard.module.css'
        content = template_dashboard.format(
            layout_path=layout_path, css_path=css_path, component_name=component_name, 
            nav_items=admin_nav, role="Admin", user_name="Admin User", title=title)
            
    else:
        # Public
        content = template_public.format(component_name=component_name, title=title)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Scaffolded all missing routes.")
