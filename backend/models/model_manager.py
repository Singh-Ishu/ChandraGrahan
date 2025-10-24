import torch
import torch.nn as nn
from pathlib import Path
import os

class ModelManager:
    def __init__(self):
        self.models = {}
        self.model_paths = {
            "lol_real": "trained_models_SMG_Low_Light_Enhancement/trained_models/LOL_real/model.pt"
        }
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")

    async def load_models(self):
        """Load all available models"""
        for model_id, model_path in self.model_paths.items():
            try:
                if os.path.exists(model_path):
                    # Load the model
                    model = torch.load(model_path, map_location=self.device)
                    if isinstance(model, dict):
                        # If it's a state dict, we need to create the model architecture first
                        # For now, we'll assume the model is already complete
                        self.models[model_id] = model
                    else:
                        self.models[model_id] = model
                    print(f"Loaded {model_id} model successfully")
                else:
                    print(f"Model file not found: {model_path}")
            except Exception as e:
                print(f"Error loading {model_id} model: {e}")

    def get_model(self, model_id):
        """Get a specific model by ID"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not loaded")
        return self.models[model_id]

    def is_model_loaded(self, model_id):
        """Check if a model is loaded"""
        return model_id in self.models

    def get_available_models(self):
        """Get list of available models"""
        return list(self.models.keys())
