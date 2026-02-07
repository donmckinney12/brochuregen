import sys
import asyncio
import uvicorn
import os

if __name__ == "__main__":
    # Remove the directory from sys.path to avoid module name conflicts if needed
    # But adding 'backend' to path is useful
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))

    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # We are inside backend/, so app_dir="." (relative to this file) or just "main:app" if cwd is backend
    # If run from root, we need to be careful.
    # Let's assume this is run with cwd=backend or we just invoke uvicorn on main:app
    
    uvicorn.run("app:app", host="127.0.0.1", port=8002, reload=False)
