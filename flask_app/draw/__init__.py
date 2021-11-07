'''
File name: draw/__init__.py (draw package)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /draw directory is a Python package.
(Allows us to import the draw blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the Auth package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/12/2021
Last Modified: 11/01/2021
'''

from flask import Blueprint

# Blueprint configuration
draw_blueprint = Blueprint(
    # blueprint name
    'draw_blueprint',
    # import_name (current Python module)
     __name__,
    # use the template folder local to draw/
    template_folder='templates',
    # use the static folder local to draw/
    static_folder='static',
    # configure the url path for draw's static folder
    # (the html references this)
    static_url_path='/draw/static'
)

# Import the views module (routing functions) for the draw blueprint 
# We import this at the bottom of the file because draw/views.py imports the draw_blueprint 
# The blueprint must be defined before importing.
from . import views
