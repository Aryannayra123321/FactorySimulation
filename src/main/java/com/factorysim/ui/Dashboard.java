package com.factorysim.ui;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class Dashboard extends JFrame {
    public Dashboard() {
        // Frame Settings
        setTitle("Factory Simulation - Dashboard");
        setSize(900, 550);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Header Panel
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(0, 102, 204));
        JLabel titleLabel = new JLabel("🏭 Factory Simulation - Dashboard");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(Color.WHITE);
        headerPanel.add(titleLabel);
        add(headerPanel, BorderLayout.NORTH);

        // Main Content Panel
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new GridLayout(1, 2, 20, 20));
        mainPanel.setBackground(new Color(40, 40, 40));

        // Machine Queue
        JPanel machinePanel = new JPanel(new BorderLayout());
        machinePanel.setBorder(BorderFactory.createTitledBorder("⚙️ Machine Queue"));
        JTextArea machineQueueArea = new JTextArea();
        machineQueueArea.setEditable(false);
        machineQueueArea.setBackground(Color.WHITE);
        machinePanel.add(new JScrollPane(machineQueueArea), BorderLayout.CENTER);
        mainPanel.add(machinePanel);

        // Adjuster Queue
        JPanel adjusterPanel = new JPanel(new BorderLayout());
        adjusterPanel.setBorder(BorderFactory.createTitledBorder("👨‍🔧 Adjuster Queue"));
        JTextArea adjusterQueueArea = new JTextArea();
        adjusterQueueArea.setEditable(false);
        adjusterQueueArea.setBackground(Color.WHITE);
        adjusterPanel.add(new JScrollPane(adjusterQueueArea), BorderLayout.CENTER);
        mainPanel.add(adjusterPanel);

        add(mainPanel, BorderLayout.CENTER);

        // Bottom Button Panel
        JPanel buttonPanel = new JPanel();
        buttonPanel.setBackground(new Color(230, 230, 230));

        JButton addMachineButton = createStyledButton("➕ Add Machine", new Color(34, 177, 76));
        JButton addAdjusterButton = createStyledButton("👷 Add Adjuster", new Color(255, 165, 0));
        JButton assignRepairButton = createStyledButton("🔧 Assign Repair", new Color(220, 20, 60));

        buttonPanel.add(addMachineButton);
        buttonPanel.add(addAdjusterButton);
        buttonPanel.add(assignRepairButton);
        add(buttonPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    // Custom Styled Button Method
    private JButton createStyledButton(String text, Color color) {
        JButton button = new JButton(text);
        button.setFont(new Font("Arial", Font.BOLD, 14));
        button.setBackground(color);
        button.setForeground(Color.WHITE);
        button.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));

        button.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                button.setBackground(color.darker());
            }
            public void mouseExited(MouseEvent evt) {
                button.setBackground(color);
            }
        });

        return button;
    }
}
