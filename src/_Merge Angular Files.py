import os
from pathlib import Path

def merge_typescript_files(root_folder: str, output_file: str):
    """
    Recursively search through folders and merge specific TypeScript files into a single file.
    
    Args:
        root_folder (str): Path to the root folder to start searching
        output_file (str): Path to the output file where content will be merged
    """
    # TypeScript extensions to look for
    ts_extensions = [
        '.component.ts',
        '.model.ts',
        '.guard.ts',
        '.service.ts',
        '.actions.ts',
        '.effects.ts',
        '.reducer.ts',
        '.selector.ts',
        '.state.ts',
        '.utils.ts'
    ]
    
    # Create or clear the output file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    open(output_file, 'w', encoding='utf-8').close()
    
    # Walk through all directories and subdirectories
    for root, _, files in os.walk(root_folder):
        for file in files:
            # Check if file ends with any of the specified extensions
            if any(file.endswith(ext) for ext in ts_extensions):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, root_folder)
                
                try:
                    # Read the content of the TypeScript file
                    with open(file_path, 'r', encoding='utf-8') as ts_file:
                        content = ts_file.read()
                    
                    # Append the content to the output file with the file path as a comment
                    with open(output_file, 'a', encoding='utf-8') as out_file:
                        out_file.write(f'// File: {relative_path}\n')
                        out_file.write(f'// {"-" * 80}\n\n')
                        out_file.write(content)
                        out_file.write('\n\n')
                        
                    print(f'Merged: {relative_path}')
                
                except Exception as e:
                    print(f'Error processing {relative_path}: {str(e)}')

def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Set root folder to the script directory
    root_folder = script_dir
    
    # Create output folder path
    output_dir = os.path.join(root_folder, '_Merge Output')
    output_file = os.path.join(output_dir, 'merged_typescript.ts')
    
    print(f'\nStarting to merge TypeScript files from: {root_folder}')
    print(f'Output file will be created at: {output_file}\n')
    
    # Merge the files
    merge_typescript_files(root_folder, output_file)
    
    print('\nMerge completed!')
    input('\nPress Enter to exit...')

if __name__ == '__main__':
    main()