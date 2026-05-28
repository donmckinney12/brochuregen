import os, re

app_dir = r'd:\BrochureGen\frontend\src\app\(app)'
dirs = ['dashboard', 'command', 'brand', 'templates', 'insights', 'leads', 'feedback', 'settings']

for d in dirs:
    page_path = os.path.join(app_dir, d, 'page.tsx')
    if os.path.exists(page_path):
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove import
        content = re.sub(r"import SuiteLayout from '@/components/SuiteLayout';\n?", "", content)
        
        # Remove wrapper tags
        content = re.sub(r"<SuiteLayout>", "<>", content)
        content = re.sub(r"</SuiteLayout>", "</>", content)
        
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated", page_path)
