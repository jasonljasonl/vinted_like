import os
import importlib

def auto_import_models_from_package(package_path: str, base_dir: str = "backend"):

    for root, dirs, files in os.walk(package_path):
        for file in files:
            if file.endswith(".py") and not file.startswith("__"):
                full_path = os.path.join(root, file)
                module_path = full_path.replace("/", ".").replace("\\", ".")
                if module_path.endswith(".py"):
                    module_path = module_path[:-3]
                if base_dir in module_path:
                    try:
                        importlib.import_module(module_path)
                    except Exception as e:
                        print(f"Error importing {module_path}: {e}")
