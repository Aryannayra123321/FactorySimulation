package com.factorysim.ui;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class LoginScreen extends JFrame {
    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginButton;

    public LoginScreen() {
        // Frame Settings
        setTitle("Factory Simulation - Login");
        setSize(420, 350);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setUndecorated(false); // Show Title Bar
        setLayout(new BorderLayout());

        // Background Panel with Gradient
        JPanel mainPanel = new JPanel() {
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                Color color1 = new Color(0, 100, 200);
                Color color2 = new Color(30, 30, 30);
                GradientPaint gp = new GradientPaint(0, 0, color1, getWidth(), getHeight(), color2);
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        mainPanel.setLayout(new GridBagLayout());
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.gridx = 0;
        gbc.gridy = 0;

        // Title Label
        JLabel titleLabel = new JLabel("Factory Simulation");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(Color.WHITE);
        mainPanel.add(titleLabel, gbc);

        // Username Field
        gbc.gridy++;
        JLabel userLabel = new JLabel("Username:");
        userLabel.setForeground(Color.WHITE);
        mainPanel.add(userLabel, gbc);

        gbc.gridy++;
        usernameField = new JTextField(15);
        usernameField.setFont(new Font("Arial", Font.PLAIN, 16));
        usernameField.setBorder(BorderFactory.createLineBorder(Color.WHITE, 1));
        usernameField.setBackground(new Color(240, 240, 240));
        usernameField.setForeground(Color.BLACK);
        mainPanel.add(usernameField, gbc);

        // Password Field
        gbc.gridy++;
        JLabel passLabel = new JLabel("Password:");
        passLabel.setForeground(Color.WHITE);
        mainPanel.add(passLabel, gbc);

        gbc.gridy++;
        passwordField = new JPasswordField(15);
        passwordField.setFont(new Font("Arial", Font.PLAIN, 16));
        passwordField.setBorder(BorderFactory.createLineBorder(Color.WHITE, 1));
        passwordField.setBackground(new Color(240, 240, 240));
        passwordField.setForeground(Color.BLACK);
        mainPanel.add(passwordField, gbc);

        // Login Button with Hover Effect
        gbc.gridy++;
        loginButton = new JButton("Login");
        loginButton.setFont(new Font("Arial", Font.BOLD, 16));
        loginButton.setBackground(new Color(50, 150, 250));
        loginButton.setForeground(Color.WHITE);
        loginButton.setBorder(BorderFactory.createLineBorder(Color.WHITE, 1));
        loginButton.setCursor(new Cursor(Cursor.HAND_CURSOR));

        loginButton.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                loginButton.setBackground(new Color(30, 120, 220));
            }
            public void mouseExited(MouseEvent evt) {
                loginButton.setBackground(new Color(50, 150, 250));
            }
        });

        mainPanel.add(loginButton, gbc);

        add(mainPanel);

        loginButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            if (username.equals("admin") && password.equals("password")) {
                JOptionPane.showMessageDialog(this, "✅ Login Successful!");
                new Dashboard();
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "❌ Invalid Credentials!");
            }
        });

        setVisible(true);
    }
}
