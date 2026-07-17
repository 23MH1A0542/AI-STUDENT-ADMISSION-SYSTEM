"""initial

Revision ID: 001
Revises: None
Create Date: 2026-07-15 12:00:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False, server_default='student'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)

    # Courses
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('department', sa.String(), nullable=False),
        sa.Column('credits', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('capacity', sa.Integer(), nullable=False, server_default='50'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true')
    )
    op.create_index('ix_courses_code', 'courses', ['code'], unique=True)
    op.create_index('ix_courses_name', 'courses', ['name'], unique=False)
    op.create_index('ix_courses_department', 'courses', ['department'], unique=False)
    op.create_index('ix_courses_id', 'courses', ['id'], unique=False)

    # Applications
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('student_id', sa.Integer(), nullable=False),
        sa.Column('course_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='submitted'),
        sa.Column('gpa', sa.Float(), nullable=False),
        sa.Column('statement_of_purpose', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['student_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='SET NULL')
    )
    op.create_index('ix_applications_id', 'applications', ['id'], unique=False)

    # Documents
    op.create_table(
        'documents',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('application_id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(), nullable=False),
        sa.Column('file_type', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id'], ondelete='CASCADE')
    )
    op.create_index('ix_documents_id', 'documents', ['id'], unique=False)

    # Chat Histories
    op.create_table(
        'chat_histories',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('sender', sa.String(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    op.create_index('ix_chat_histories_id', 'chat_histories', ['id'], unique=False)

def downgrade() -> None:
    op.drop_table('chat_histories')
    op.drop_table('documents')
    op.drop_table('applications')
    op.drop_table('courses')
    op.drop_table('users')
