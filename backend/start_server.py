#!/usr/bin/env python3
"""
Startup script for the ChandraGrahan Low Light Enhancement API
"""

import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("Starting ChandraGrahan Low Light Enhancement API...")
    print("Backend will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
